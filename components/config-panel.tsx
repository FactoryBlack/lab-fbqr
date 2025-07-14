"use client"

import React, { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { NeoButton } from "@/components/ui/neo-button"
import { BrutalistSlider } from "@/components/ui/brutalist-slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "./ui/scroll-area"
import type { ConfigPanelProps, DotsOptions, CornersSquareOptions, CornersDotOptions, BackgroundOptions } from "@/types"
import { GradientControls } from "./gradient-controls"
import { contentTypes, type ContentType } from "./content-type-icons"
import { useIsMobile } from "@/components/ui/use-mobile"

type StyleOptionKey = "dotsOptions" | "cornersSquareOptions" | "cornersDotOptions" | "backgroundOptions"

function getInitialState(initialText: string) {
  const state = {
    activeTab: "url" as ContentType,
    urlValue: "",
    textValue: "",
    emailData: { to: "", subject: "", body: "" },
    phoneValue: "",
    smsData: { to: "", message: "" },
    wifiData: { ssid: "", password: "", encryption: "WPA" as "WPA" | "WEP" | "nopass" },
  }

  if (!initialText) {
    state.activeTab = "url"
    state.urlValue = "https://lab.factory.black"
    return state
  }

  if (initialText.startsWith("mailto:")) {
    state.activeTab = "email"
    const [to, params] = initialText.replace("mailto:", "").split("?")
    state.emailData.to = to || ""
    if (params) {
      const searchParams = new URLSearchParams(params)
      state.emailData.subject = searchParams.get("subject") || ""
      state.emailData.body = searchParams.get("body") || ""
    }
  } else if (initialText.startsWith("tel:")) {
    state.activeTab = "phone"
    state.phoneValue = initialText.replace("tel:", "")
  } else if (initialText.startsWith("smsto:")) {
    state.activeTab = "sms"
    const parts = initialText.replace("smsto:", "").split(":")
    state.smsData.to = parts[0] || ""
    state.smsData.message = parts.slice(1).join(":") || ""
  } else if (initialText.startsWith("WIFI:")) {
    state.activeTab = "wifi"
    const wifiString = initialText.replace("WIFI:", "")
    const parts = wifiString.split(";").filter(Boolean)
    parts.forEach((part) => {
      if (part.startsWith("S:")) state.wifiData.ssid = part.substring(2).replace(/\\;/g, ";")
      if (part.startsWith("T:")) state.wifiData.encryption = part.substring(2) as any
      if (part.startsWith("P:")) state.wifiData.password = part.substring(2).replace(/\\;/g, ";")
    })
  } else if (initialText.startsWith("http") || initialText.includes(".")) {
    state.activeTab = "url"
    state.urlValue = initialText
  } else {
    state.activeTab = "text"
    state.textValue = initialText
  }

  return state
}

export default function ConfigPanel({
  text,
  onTextChange,
  styleOptions,
  onStyleChange,
  onGenerateClick,
  isGenerating,
  onLogoUpload,
  logoPreview,
  onRemoveLogo,
  onShortenUrl,
  isShortening,
}: ConfigPanelProps) {
  const fileInputRef = React.createRef<HTMLInputElement>()
  const isMobile = useIsMobile()

  const [initialState] = useState(() => getInitialState(text))

  const [activeTab, setActiveTab] = useState<ContentType>(initialState.activeTab)
  const [urlValue, setUrlValue] = useState(initialState.urlValue)
  const [textValue, setTextValue] = useState(initialState.textValue)
  const [emailData, setEmailData] = useState(initialState.emailData)
  const [phoneValue, setPhoneValue] = useState(initialState.phoneValue)
  const [smsData, setSmsData] = useState(initialState.smsData)
  const [wifiData, setWifiData] = useState(initialState.wifiData)

  useEffect(() => {
    let newText = ""
    switch (activeTab) {
      case "url":
        newText = urlValue
        break
      case "text":
        newText = textValue
        break
      case "email": {
        const { to, subject, body } = emailData
        const params = new URLSearchParams()
        if (subject) params.set("subject", subject)
        if (body) params.set("body", body)
        const paramString = params.toString()
        newText = `mailto:${to}${paramString ? `?${paramString}` : ""}`
        break
      }
      case "phone":
        newText = `tel:${phoneValue}`
        break
      case "sms":
        newText = `smsto:${smsData.to}:${smsData.message}`
        break
      case "wifi": {
        const { ssid, password, encryption } = wifiData
        const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/:/g, "\\:")
        newText = `WIFI:S:${escape(ssid)};T:${encryption};P:${escape(password)};;`
        break
      }
    }
    onTextChange(newText)
  }, [activeTab, urlValue, textValue, emailData, phoneValue, smsData, wifiData, onTextChange])

  const handleTabChange = (newTab: ContentType) => {
    setActiveTab(newTab)
    switch (newTab) {
      case "text":
        if (!textValue) setTextValue("Your text here...")
        break
      case "email":
        if (!emailData.to && !emailData.subject && !emailData.body) {
          setEmailData({ to: "example@email.com", subject: "Hello from FBQR", body: "This is a test message." })
        }
        break
      case "phone":
        if (!phoneValue) setPhoneValue("1234567890")
        break
      case "sms":
        if (!smsData.to && !smsData.message) {
          setSmsData({ to: "1234567890", message: "Your SMS message." })
        }
        break
      case "wifi":
        if (!wifiData.ssid && !wifiData.password) {
          setWifiData({ ssid: "MyNetwork", password: "password123", encryption: "WPA" })
        }
        break
      default:
        break
    }
  }

  const isUrl = (str: string) => {
    if (!str || str.startsWith("fblk.io") || str.length < 15) return false
    try {
      new URL(str)
      return true
    } catch (_) {
      return false
    }
  }

  const handleStyleValueChange = (path: string, value: any) => {
    const newStyle = JSON.parse(JSON.stringify(styleOptions))
    const keys = path.split(".")
    let current: any = newStyle
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = current[keys[i]] ? { ...current[keys[i]] } : {}
    }
    current[keys[keys.length - 1]] = value
    onStyleChange(newStyle)
  }

  const handleGradientOptionChange = (
    optionKey: StyleOptionKey,
    newValues: Partial<DotsOptions | CornersSquareOptions | CornersDotOptions | BackgroundOptions>,
  ) => {
    const newOptions = {
      ...styleOptions[optionKey],
      ...newValues,
    }
    onStyleChange({ ...styleOptions, [optionKey]: newOptions })
  }

  const renderContentInputs = () => {
    switch (activeTab) {
      case "url":
        return (
          <div className="space-y-2">
            <Textarea
              id="text"
              placeholder="https://lab.factory.black"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              rows={3}
              className={isUrl(urlValue) ? "rounded-b-none" : ""}
            />
            {isUrl(urlValue) && (
              <NeoButton
                size="sm"
                variant="default"
                onClick={onShortenUrl}
                disabled={isShortening}
                className="uppercase rounded-t-none -mt-px w-full"
              >
                {isShortening ? "SHORTENING..." : "SHORTEN URL & MAKE DYNAMIC"}
              </NeoButton>
            )}
          </div>
        )
      case "text":
        return (
          <Textarea
            placeholder="Enter your text here"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={4}
          />
        )
      case "email":
        return (
          <div className="space-y-4">
            <Input
              placeholder="Email address"
              value={emailData.to}
              onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
            />
            <Input
              placeholder="Subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            />
            <Textarea
              placeholder="Message"
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              rows={2}
            />
          </div>
        )
      case "phone":
        return (
          <Input
            type="tel"
            placeholder="Phone number"
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
          />
        )
      case "sms":
        return (
          <div className="space-y-4">
            <Input
              type="tel"
              placeholder="Phone number"
              value={smsData.to}
              onChange={(e) => setSmsData({ ...smsData, to: e.target.value })}
            />
            <Textarea
              placeholder="Message"
              value={smsData.message}
              onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
              rows={2}
            />
          </div>
        )
      case "wifi":
        return (
          <div className="space-y-4">
            <Input
              placeholder="Network Name (SSID)"
              value={wifiData.ssid}
              onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
            />
            <Input
              placeholder="Password"
              value={wifiData.password}
              onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
            />
            <Select
              value={wifiData.encryption}
              onValueChange={(v) => setWifiData({ ...wifiData, encryption: v as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">No Encryption</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="p-6 border-b-2 border-[#1c1c1c]">
        <h2 className="font-heading text-3xl mb-4">CONTENT</h2>
        <div className="grid grid-cols-3 gap-2">
          {contentTypes.map((ct) => (
            <NeoButton
              key={ct.id}
              variant={activeTab === ct.id ? "secondary" : "outline"}
              onClick={() => handleTabChange(ct.id)}
              size="sm"
              className="flex items-center justify-center gap-2"
              noShadow={activeTab === ct.id}
            >
              <ct.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{ct.label}</span>
            </NeoButton>
          ))}
        </div>
        <div className="mt-4">{renderContentInputs()}</div>
      </div>

      <ScrollArea className="flex-1">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="dots">
            <AccordionTrigger>DOTS</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="font-sans font-normal text-sm">Style</Label>
                <Select
                  value={styleOptions.dotsOptions.type}
                  onValueChange={(v) => handleStyleValueChange("dotsOptions.type", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                    <SelectItem value="classy">Classy</SelectItem>
                    <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                    <SelectItem value="dots">Dots (Circle)</SelectItem>
                    <SelectItem value="fluid">Fluid</SelectItem>
                    <SelectItem value="fluid-smooth">Fluid (Smooth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <GradientControls
                label="dots"
                color={styleOptions.dotsOptions.color || "#1c1c1c"}
                onColorChange={(c) => handleGradientOptionChange("dotsOptions", { color: c })}
                useGradient={styleOptions.dotsOptions.useGradient}
                onUseGradientChange={(use) => handleGradientOptionChange("dotsOptions", { useGradient: use })}
                gradient={styleOptions.dotsOptions.gradient}
                onGradientChange={(g) => handleGradientOptionChange("dotsOptions", { gradient: g })}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="corners">
            <AccordionTrigger>CORNERS</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="space-y-4">
                <Label className="font-sans font-bold text-base uppercase mb-2 block">Corner Squares</Label>
                <div className="space-y-2">
                  <Label className="font-sans font-normal text-sm">Style</Label>
                  <Select
                    value={styleOptions.cornersSquareOptions?.type || "square"}
                    onValueChange={(v) => handleStyleValueChange("cornersSquareOptions.type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                      <SelectItem value="dot">Dot (Circle)</SelectItem>
                      <SelectItem value="classy">Classy</SelectItem>
                      <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <GradientControls
                  label="corners-square"
                  color={styleOptions.cornersSquareOptions?.color || "#1c1c1c"}
                  onColorChange={(c) => handleGradientOptionChange("cornersSquareOptions", { color: c })}
                  useGradient={styleOptions.cornersSquareOptions.useGradient}
                  onUseGradientChange={(use) =>
                    handleGradientOptionChange("cornersSquareOptions", { useGradient: use })
                  }
                  gradient={styleOptions.cornersSquareOptions.gradient}
                  onGradientChange={(g) => handleGradientOptionChange("cornersSquareOptions", { gradient: g })}
                />
              </div>
              <div className="space-y-4">
                <Label className="font-sans font-bold text-base uppercase mb-2 block">Corner Dots</Label>
                <div className="space-y-2">
                  <Label className="font-sans font-normal text-sm">Style</Label>
                  <Select
                    value={styleOptions.cornersDotOptions?.type ?? "inherit"}
                    onValueChange={(v) => handleStyleValueChange("cornersDotOptions.type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">Inherit</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                      <SelectItem value="dot">Dot (Circle)</SelectItem>
                      <SelectItem value="classy">Classy</SelectItem>
                      <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <GradientControls
                  label="corners-dot"
                  color={styleOptions.cornersDotOptions?.color || "#1c1c1c"}
                  onColorChange={(c) => handleGradientOptionChange("cornersDotOptions", { color: c })}
                  useGradient={styleOptions.cornersDotOptions.useGradient}
                  onUseGradientChange={(use) => handleGradientOptionChange("cornersDotOptions", { useGradient: use })}
                  gradient={styleOptions.cornersDotOptions.gradient}
                  onGradientChange={(g) => handleGradientOptionChange("cornersDotOptions", { gradient: g })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="background">
            <AccordionTrigger>BACKGROUND</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transparent-bg"
                  checked={styleOptions.backgroundOptions.color === "transparent"}
                  onCheckedChange={(c) =>
                    handleStyleValueChange("backgroundOptions.color", c ? "transparent" : "#e0e0e0")
                  }
                />
                <label htmlFor="transparent-bg" className="text-base font-bold font-sans uppercase">
                  Transparent
                </label>
              </div>
              {styleOptions.backgroundOptions.color !== "transparent" && (
                <GradientControls
                  label="background"
                  color={styleOptions.backgroundOptions.color || "#e0e0e0"}
                  onColorChange={(c) => handleGradientOptionChange("backgroundOptions", { color: c })}
                  useGradient={styleOptions.backgroundOptions.useGradient}
                  onUseGradientChange={(use) => handleGradientOptionChange("backgroundOptions", { useGradient: use })}
                  gradient={styleOptions.backgroundOptions.gradient}
                  onGradientChange={(g) => handleGradientOptionChange("backgroundOptions", { gradient: g })}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="logo" className="border-b-0">
            <AccordionTrigger>LOGO</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {logoPreview ? (
                <NeoButton variant="destructive" onClick={onRemoveLogo}>
                  REMOVE LOGO
                </NeoButton>
              ) : (
                <NeoButton variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  UPLOAD LOGO
                </NeoButton>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />

              {logoPreview && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="font-sans font-bold uppercase text-sm">Logo Size</Label>
                    <BrutalistSlider
                      value={[styleOptions.imageOptions.imageSize]}
                      max={0.4}
                      step={0.01}
                      onValueChange={(v) => handleStyleValueChange("imageOptions.imageSize", v[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans font-bold uppercase text-sm">Logo Margin</Label>
                    <BrutalistSlider
                      value={[styleOptions.imageOptions.margin]}
                      max={40}
                      step={1}
                      onValueChange={(v) => handleStyleValueChange("imageOptions.margin", v[0])}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hide-dots"
                      checked={styleOptions.imageOptions.hideBackgroundDots}
                      onCheckedChange={(c) => handleStyleValueChange("imageOptions.hideBackgroundDots", c)}
                    />
                    <label htmlFor="hide-dots" className="text-base font-bold font-sans uppercase">
                      Hide dots behind logo
                    </label>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>

      <div className="mt-auto p-6 border-t-2 border-[#1c1c1c]">
        <NeoButton
          onClick={onGenerateClick}
          disabled={isGenerating || !text.trim()}
          size="lg"
          className="uppercase w-full"
        >
          {isGenerating ? "GENERATING..." : "ADD TO COLLECTION"}
        </NeoButton>
      </div>
    </div>
  )
}
