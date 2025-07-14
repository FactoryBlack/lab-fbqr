import { Link, Type, Mail, Phone, MessageSquare, Wifi } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ContentType = "url" | "text" | "email" | "phone" | "sms" | "wifi"

export const contentTypes: {
  id: ContentType
  label: string
  icon: LucideIcon
}[] = [
  { id: "url", label: "URL", icon: Link },
  { id: "text", label: "Text", icon: Type },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
]
