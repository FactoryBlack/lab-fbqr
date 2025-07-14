"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useFormState } from "react-dom"
import { updateUsername } from "./actions"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NeoButton } from "@/components/ui/neo-button"

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters.").max(50, "Username is too long."),
})

const initialState = {
  message: "",
  error: false,
}

export function AccountForm() {
  const [state, formAction] = useFormState(updateUsername, initialState)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.message,
        variant: state.error ? "destructive" : "success",
      })
    }
  }, [state, toast])

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans font-bold uppercase">Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Your cool name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <NeoButton type="submit">Update</NeoButton>
      </form>
    </Form>
  )
}
