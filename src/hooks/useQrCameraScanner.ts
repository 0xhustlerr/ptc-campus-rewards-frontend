"use client";

import { BrowserQRCodeReader } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState } from "react";

export type QrCameraStatus = "idle" | "starting" | "active" | "error" | "paused";

type UseQrCameraScannerOptions = {
  onDetect: (text: string) => void;
  paused: boolean;
  disabled: boolean;
};

const SCAN_COOLDOWN_MS = 3000;

function getCameraErrorMessage(err: unknown): string {
  if (err instanceof DOMException) {
    if (err.name === "NotAllowedError") {
      return "Camera access was denied. Allow camera permission or enter the token manually below.";
    }
    if (err.name === "NotFoundError") {
      return "No camera found on this device. Enter the token manually below.";
    }
    if (err.name === "NotReadableError") {
      return "Camera is in use by another app. Close it or enter the token manually below.";
    }
  }
  return "Unable to start camera. Enter the token manually below.";
}

export function useQrCameraScanner({ onDetect, paused, disabled }: UseQrCameraScannerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);
  const lastScanRef = useRef<{ text: string; at: number } | null>(null);
  const onDetectRef = useRef(onDetect);
  const pausedRef = useRef(paused);
  const disabledRef = useRef(disabled);

  const [cameraState, setCameraState] = useState<"idle" | "starting" | "active" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onDetectRef.current = onDetect;
  }, [onDetect]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  const stopCamera = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!videoRef.current || pausedRef.current || disabledRef.current) {
      return;
    }

    stopCamera();
    setCameraState("starting");
    setError(null);

    if (!readerRef.current) {
      readerRef.current = new BrowserQRCodeReader();
    }
    const reader = readerRef.current;

    const handleResult = (text: string) => {
      if (pausedRef.current || disabledRef.current) {
        return;
      }
      const now = Date.now();
      const last = lastScanRef.current;
      if (last && last.text === text && now - last.at < SCAN_COOLDOWN_MS) {
        return;
      }
      lastScanRef.current = { text, at: now };
      onDetectRef.current(text);
    };

    const onDecode = (result: { getText(): string } | undefined) => {
      if (result) {
        handleResult(result.getText());
      }
    };

    try {
      controlsRef.current = await reader.decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        videoRef.current,
        onDecode,
      );
      setCameraState("active");
    } catch {
      try {
        controlsRef.current = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          onDecode,
        );
        setCameraState("active");
      } catch (err) {
        stopCamera();
        setCameraState("error");
        setError(getCameraErrorMessage(err));
      }
    }
  }, [stopCamera]);

  useEffect(() => {
    if (paused || disabled) {
      stopCamera();
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      void (async () => {
        if (!videoRef.current || pausedRef.current || disabledRef.current) {
          return;
        }

        stopCamera();
        setCameraState("starting");
        setError(null);

        if (!readerRef.current) {
          readerRef.current = new BrowserQRCodeReader();
        }
        const reader = readerRef.current;

        const handleResult = (text: string) => {
          if (pausedRef.current || disabledRef.current) {
            return;
          }
          const now = Date.now();
          const last = lastScanRef.current;
          if (last && last.text === text && now - last.at < SCAN_COOLDOWN_MS) {
            return;
          }
          lastScanRef.current = { text, at: now };
          onDetectRef.current(text);
        };

        const onDecode = (result: { getText(): string } | undefined) => {
          if (result) {
            handleResult(result.getText());
          }
        };

        try {
          controlsRef.current = await reader.decodeFromConstraints(
            {
              video: {
                facingMode: { ideal: "environment" },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
            },
            videoRef.current,
            onDecode,
          );
          if (!cancelled) {
            setCameraState("active");
          }
        } catch {
          try {
            controlsRef.current = await reader.decodeFromVideoDevice(
              undefined,
              videoRef.current,
              onDecode,
            );
            if (!cancelled) {
              setCameraState("active");
            }
          } catch (err) {
            stopCamera();
            if (!cancelled) {
              setCameraState("error");
              setError(getCameraErrorMessage(err));
            }
          }
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      stopCamera();
    };
  }, [paused, disabled, stopCamera]);

  const retry = useCallback(() => {
    lastScanRef.current = null;
    setCameraState("idle");
    setError(null);
    void startCamera();
  }, [startCamera]);

  const clearCooldown = useCallback(() => {
    lastScanRef.current = null;
  }, []);

  const status: QrCameraStatus = paused
    ? "paused"
    : cameraState === "error"
      ? "error"
      : cameraState;

  return { videoRef, status, error, retry, clearCooldown };
}
