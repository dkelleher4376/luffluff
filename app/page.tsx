"use client"

import React, { useState, useRef } from "react"
import { Slider } from "@/components/Slider"

export default function Home() {
  const [zoomScale, setZoomScale] = useState(2.5) // Start at "Far" (2.5)
  const [zoomSpeed, setZoomSpeed] = useState(0.005) // Start at "Slow" (mapped to 3000ms)
  const [isZooming, setIsZooming] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [focusPoint, setFocusPoint] = useState({ x: 0.5, y: 0.5 }) // Normalized focus point (0 to 1)
  const [filter, setFilter] = useState("none") // Track selected filter
  const imageRef = useRef<HTMLImageElement>(null)

  const handleZoomSpeedChange = (value: number[]) => {
    const newValue = Math.round(value[0] / 0.5) * 0.5
    setZoomSpeed(newValue / 100)
  }

  const handleZoomScaleChange = (value: number[]) => {
    const newValue = Math.round(value[0] / 0.25) * 0.25 // Step of 0.25 for 5 notches
    setZoomScale(newValue)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImageSrc(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      setFocusPoint({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) })
    }
  }

  const handleAnimationToggle = () => {
    setIsZooming((prev) => {
      if (!prev && imageRef.current) {
        imageRef.current.style.animationName = "zoomInOut"
        imageRef.current.style.animationDuration = `${animationDuration}s`
        imageRef.current.style.animationTimingFunction = "ease-in-out"
        imageRef.current.style.animationIterationCount = "infinite"
      }
      return !prev
    })
  }

  const resetSettings = () => {
    setZoomScale(2.5) // Reset to "Far" (2.5)
    setZoomSpeed(0.005) // Reset to "Slow" (mapped to 3000ms)
    setIsZooming(false)
    setFocusPoint({ x: 0.5, y: 0.5 }) // Reset focus to center
    setFilter("none") // Reset filter
    if (imageRef.current) {
      imageRef.current.style.animation = "none"
      imageRef.current.style.transform = "scale(1)"
      imageRef.current.style.filter = "none"
    }
  }

  const animationDuration = (4000 - (zoomSpeed * 3500)) / 100 + 1 // Map 0.005-0.025 to 3000-1000ms

  const applyFilter = (filterValue: string) => {
    if (imageRef.current) {
      switch (filterValue) {
        case "vivid":
          imageRef.current.style.filter = "contrast(1.2) saturate(1.5)";
          break;
        case "vividwarm":
          imageRef.current.style.filter = "contrast(1.2) saturate(1.5) sepia(0.3)";
          break;
        case "dramatic":
          imageRef.current.style.filter = "contrast(1.5) brightness(0.9)";
          break;
        case "dramaticwarm":
          imageRef.current.style.filter = "contrast(1.5) brightness(0.9) sepia(0.4)";
          break;
        case "mono":
          imageRef.current.style.filter = "grayscale(100%)";
          break;
        default:
          imageRef.current.style.filter = "none";
      }
    }
  };

  return (
    <div className="text-center">
      <h1 style={{ fontFamily: "Copperplate, serif", fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", fontSize: "4rem" }}>LUFF</h1>
      <div style={{ lineHeight: "2.5" }}>
        {[...Array(2)].map((_, i) => <div key={i} style={{ height: "10px" }}></div>)} {/* 2 lines (20px) above "Upload a photo that you luff" */}
        <p style={{ fontFamily: "Copperplate, serif", fontWeight: "bold", textTransform: "uppercase" }}>Upload a photo that you luff</p>
        <div style={{ height: "2px" }} /> {/* 2px between "Upload a photo..." and "Put on your favorite song" */}
        <p style={{ fontFamily: "Copperplate, serif", fontWeight: "bold", textTransform: "uppercase", margin: "2px 0" }}>Put on your favorite song</p>
        <div style={{ height: "2px" }} /> {/* 2px between "Put on your favorite song" and "And enjoy the zooms!" */}
        <p style={{ fontFamily: "Copperplate, serif", fontWeight: "bold", textTransform: "uppercase" }}>And enjoy the zooms!</p>
        {[...Array(2)].map((_, i) => <div key={i + 3} style={{ height: "10px" }}></div>)} {/* 2 lines (20px) above "Upload photo:" */}
        <p style={{ fontFamily: "Copperplate, serif", textTransform: "capitalize" }}>Upload photo:</p>
        <label style={{ backgroundColor: "#d3d3d3", padding: "10px 40px", borderRadius: "20px", cursor: "pointer" }}>
          <span style={{ color: "blue", fontFamily: "Copperplate, serif", textTransform: "uppercase" }}>Choose File</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
        </label>
        {[...Array(1)].map((_, i) => <div key={i + 5} style={{ height: "10px" }}></div>)} {/* 1 line (10px) below "Choose File" */}
      </div>
      <div style={{ lineHeight: "2", position: "relative", minHeight: "300px" }}>
        {[...Array(1)].map((_, i) => <div key={i + 6} style={{ height: "10px" }}></div>)} {/* 1 line (10px) below "Zoom Speed" */}
        <p style={{ textTransform: "capitalize" }}>Zoom Speed</p>
        <p> </p>
        <p> </p>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Slider
            value={[zoomSpeed * 100]}
            onValueChange={handleZoomSpeedChange}
            min={0.5}
            max={2.5}
            step={0.5}
            className="w-64"
            style={{ backgroundColor: "blue", height: "4px", borderRadius: "5px" }}
          />
        </div>
        <p> </p>
        <div style={{ display: "flex", justifyContent: "space-between", width: "16rem", margin: "0 auto", height: "2px" }}>
          <span style={{ width: "2px", height: "10px", backgroundColor: "grey" }}></span>
          <span style={{ width: "2px", height: "10px", backgroundColor: "grey" }}></span>
          <span style={{ width: "2px", height: "10px", backgroundColor: "grey" }}></span>
          <span style={{ width: "2px", height: "10px", backgroundColor: "grey" }}></span>
          <span style={{ width: "2px", height: "10px", backgroundColor: "grey" }}></span>
        </div>
        {[...Array(1)].map((_, i) => <div key={i + 7} style={{ height: "10px" }}></div>)} {/* 1 line (10px) between bar and labels */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "16rem", margin: "0 auto" }}>
          <p style={{ color: "grey" }}>Slow</p>
          <p style={{ color: "grey" }}></p>
          <p style={{ color: "grey" }}></p>
          <p style={{ color: "grey" }}></p>
          <p style={{ color: "grey" }}></p>
          <p style={{ color: "grey" }}>Fast</p>
        </div>
        <p> </p>
        <p style={{ textTransform: "capitalize" }}>Zoom Scale</p>
        <p> </p>
        <p> </p>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Slider
            value={[zoomScale]}
            onValueChange={handleZoomScaleChange}
            min={2.5}
            max={3.5}
            step={0.25}
            className="w-64"
            style={{ backgroundColor: "blue", height: "4px", borderRadius: "5px" }}
          />
        </div>
        <p> </p>
        <div style={{ display: "flex", justifyContent: "space-between", width: "16rem", margin: "0 auto", height: "2px" }}>
          <span style={{ width: "2px", height: "10px", backgroundColor: "grey" }}></span>
          <span style={{ width: "2px", height: "10px", backgroundColor: "grey" }}></span>
          <span style={{ width: "2px", height: "10px", backgroundColor: "grey" }}></span>
          <span style={{ width: "2px", height: "10px", backgroundColor: "grey" }}></span>
          <span style={{ width: "2px", height: "10px", backgroundColor: "grey" }}></span>
        </div>
        {[...Array(1)].map((_, i) => <div key={i + 8} style={{ height: "10px" }}></div>)} {/* 1 line (10px) between bar and labels */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "16rem", margin: "0 auto" }}>
          <p style={{ color: "grey" }}>Far</p>
          <p style={{ color: "grey" }}></p>
          <p style={{ color: "grey" }}></p>
          <p style={{ color: "grey" }}></p>
          <p style={{ color: "grey" }}></p>
          <p style={{ color: "grey" }}>Close</p>
        </div>
        {[...Array(1)].map((_, i) => <div key={i + 9} style={{ height: "10px" }}></div>)} {/* 1 line (10px) between Far/Close and Optional Filter */}
        {[...Array(1)].map((_, i) => <div key={i + 10} style={{ height: "10px" }}></div>)} {/* 0.5 lines (5px) approximated as 1 line above "Optional Filter:" */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontWeight: "bold" }}>Optional Filter:</p>
          <select
            value={filter}
            onChange={(e) => {
              const newFilter = e.target.value;
              setFilter(newFilter);
              applyFilter(newFilter);
            }}
            style={{ marginLeft: "10px", padding: "5px", borderRadius: "0", backgroundColor: "#d3d3d3", border: "none", width: "80px", height: "30px" }}
          >
            <option value="none">None</option>
            <option value="vivid">Vivid</option>
            <option value="vividwarm">Vivid Warm</option>
            <option value="dramatic">Dramatic</option>
            <option value="dramaticwarm">Dramatic Warm</option>
            <option value="mono">Mono</option>
          </select>
        </div>
        <p> </p>
        <p> </p>
        <p style={{ fontSize: "0.875rem" }}>Choose a filter to enhance the mood</p>
        {[...Array(2)].map((_, i) => <div key={i + 11} style={{ height: "10px" }}></div>)} {/* 2 lines (20px) below "Choose a filter..." */}
        <p style={{ fontSize: "0.875rem" }}>Click on the photo to set a custom zoom focus point</p>
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={handleAnimationToggle}
            style={{
              textTransform: "uppercase",
              backgroundColor: "gold",
              color: "white",
              padding: "5px 15px",
              border: "none",
              borderRadius: "5px",
              margin: "5px",
            }}
          >
            {isZooming ? "Pause" : "Play"}
          </button>
          <button
            onClick={resetSettings}
            style={{
              textTransform: "uppercase",
              backgroundColor: "blue",
              color: "white",
              padding: "5px 15px",
              border: "none",
              borderRadius: "5px",
              margin: "5px",
            }}
          >
            Reset Settings
          </button>
        </div>
        {imageSrc && (
          <div style={{ overflow: "hidden", display: "inline-block", maxWidth: "600px", margin: "0 auto", position: "relative" }}>
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Uploaded"
              style={{
                transformOrigin: `${focusPoint.x * 100}% ${focusPoint.y * 100}%`,
                animationName: isZooming ? "zoomInOut" : "none",
                animationDuration: isZooming ? `${animationDuration}s` : "0s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: isZooming ? "infinite" : "1",
                animationPlayState: isZooming ? "running" : "paused",
                maxWidth: "100%",
                height: "auto",
              }}
              onClick={handleImageClick}
            />
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes zoomInOut {
            0% { transform: scale(1); }
            50% { transform: scale(${Math.min(zoomScale, 3.5)}); }
            100% { transform: scale(1); }
        `}
      </style>
    </div>
  )
}