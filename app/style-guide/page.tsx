import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard, NeoCardContent, NeoCardHeader, NeoCardTitle } from "@/components/ui/neo-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const ColorSwatch = ({ name, className, varName }: { name: string; className: string; varName: string }) => (
  <div className="flex items-center gap-4">
    <div className={`h-10 w-10 border-2 border-neo-text ${className}`} />
    <div className="font-mono">
      <p className="font-bold">{name}</p>
      <p className="text-sm opacity-70">{varName}</p>
    </div>
  </div>
)

export default function StyleGuidePage() {
  return (
    <div className="bg-page-bg min-h-screen p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-5xl md:text-6xl">Style Guide</h1>
        <Link
          href="/fbqr"
          className="inline-flex items-center gap-2 font-bold font-mono uppercase hover:underline text-sm"
        >
          <ArrowLeft size={16} />
          Back to App
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div className="space-y-8">
          <NeoCard>
            <NeoCardHeader>
              <NeoCardTitle className="font-heading">Colors</NeoCardTitle>
            </NeoCardHeader>
            <NeoCardContent className="space-y-4">
              <ColorSwatch name="Background" className="bg-neo-bg" varName="neo-bg" />
              <ColorSwatch name="Off-White" className="bg-neo-off-white" varName="neo-off-white" />
              <ColorSwatch name="Text / Border" className="bg-neo-text" varName="neo-text" />
              <ColorSwatch name="Accent" className="bg-neo-accent" varName="neo-accent" />
              <ColorSwatch name="White" className="bg-neo-white" varName="neo-white" />
            </NeoCardContent>
          </NeoCard>

          <NeoCard>
            <NeoCardHeader>
              <NeoCardTitle className="font-heading">Buttons</NeoCardTitle>
            </NeoCardHeader>
            <NeoCardContent className="space-y-4">
              <NeoButton>Default Button</NeoButton>
              <NeoButton variant="outline">Outline Button</NeoButton>
              <NeoButton variant="destructive">Destructive Button</NeoButton>
            </NeoCardContent>
          </NeoCard>
        </div>

        {/* Column 2 */}
        <div className="space-y-8">
          <NeoCard>
            <NeoCardHeader>
              <NeoCardTitle className="font-heading">Typography</NeoCardTitle>
            </NeoCardHeader>
            <NeoCardContent className="space-y-4">
              <h1 className="font-heading text-4xl">Heading 1</h1>
              <h2 className="font-heading text-3xl">Heading 2</h2>
              <h3 className="font-heading text-2xl">Heading 3</h3>
              <p>This is a paragraph of body text using the default sans-serif font.</p>
              <p className="font-sans">This is a paragraph of monospaced text for UI elements and labels.</p>
            </NeoCardContent>
          </NeoCard>

          <NeoCard>
            <NeoCardHeader>
              <NeoCardTitle className="font-heading">Interactive</NeoCardTitle>
            </NeoCardHeader>
            <NeoCardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Switch id="style-guide-switch" />
                <Label htmlFor="style-guide-switch" className="font-sans font-bold">
                  Switch
                </Label>
              </div>
              <div className="flex items-center gap-4">
                <Checkbox id="style-guide-checkbox" />
                <Label htmlFor="style-guide-checkbox" className="font-sans font-bold">
                  Checkbox
                </Label>
              </div>
            </NeoCardContent>
          </NeoCard>
        </div>

        {/* Column 3 */}
        <div className="space-y-8">
          <NeoCard>
            <NeoCardHeader>
              <NeoCardTitle className="font-heading">Form Elements</NeoCardTitle>
            </NeoCardHeader>
            <NeoCardContent className="space-y-4">
              <div>
                <Label htmlFor="sg-input" className="font-sans font-bold text-sm">
                  Input Field
                </Label>
                <Input id="sg-input" placeholder="Placeholder text..." />
              </div>
              <div>
                <Label htmlFor="sg-textarea" className="font-sans font-bold text-sm">
                  Text Area
                </Label>
                <Textarea id="sg-textarea" placeholder="Placeholder text..." />
              </div>
              <div>
                <Label htmlFor="sg-select" className="font-sans font-bold text-sm">
                  Select Menu
                </Label>
                <Select>
                  <SelectTrigger id="sg-select">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Option One</SelectItem>
                    <SelectItem value="2">Option Two</SelectItem>
                    <SelectItem value="3">Option Three</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </NeoCardContent>
          </NeoCard>

          <NeoCard>
            <NeoCardHeader>
              <NeoCardTitle className="font-heading">Accordion</NeoCardTitle>
            </NeoCardHeader>
            <NeoCardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Section 1 Title</AccordionTrigger>
                  <AccordionContent>
                    This is the content for the first section of the accordion. It demonstrates the open state.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Section 2 Title</AccordionTrigger>
                  <AccordionContent>
                    This is the content for the second section. You can put any components or text in here.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </NeoCardContent>
          </NeoCard>
        </div>
      </div>
    </div>
  )
}
