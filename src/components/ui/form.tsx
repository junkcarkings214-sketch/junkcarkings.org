"use client"

import * as React from "react"
import { Controller, FormProvider, useFormContext } from "react-hook-form"
import { Slot } from "radix-ui"
import { Label } from "@/components/ui/label"

/**
 * React-Hook-Form wiring in the shadcn style.
 * The wrapper internals avoid the state generics friction by using loosely
 * typed passthroughs; the public API behaves exactly like the classic
 * shadcn/form components.
 */

type FormFieldContextValue = { name: string }
type FormItemContextValue = { id: string }

const FormFieldContext = React.createContext<FormFieldContextValue>(null as unknown as FormFieldContextValue)
const FormItemContext = React.createContext<FormItemContextValue>(null as unknown as FormItemContextValue)

/* eslint-disable @typescript-eslint/no-explicit-any */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const formContext = useFormContext() as any

  if (!fieldContext || fieldContext.name === undefined) {
    throw new Error("useFormField should be used within <FormField>")
  }
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const { id } = itemContext
  const { getFieldState, formState } = formContext
  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

function FormField(props: { control: any; name: string; [key: string]: any }) {
  const { name, ...rest } = props
  const ControllerTyped = Controller as unknown as React.ComponentType<
    Record<string, unknown>
  >

  return (
    <FormFieldContext.Provider value={{ name }}>
      <ControllerTyped name={name} {...rest} />
    </FormFieldContext.Provider>
  )
}

function Form({ ...props }: { children?: React.ReactNode }) {
  return <FormProvider {...(props as any)} />
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={"grid gap-2 " + (className ?? "")} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, children, ...props }: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-error={!!error}
      className={"data-[error=true]:text-destructive " + (className ?? "")}
      htmlFor={formItemId}
      {...props}
    >
      {children}
    </Label>
  )
}

function FormControl({ ...props }: Record<string, any>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot.Root
      id={formItemId}
      aria-describedby={
        !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      id={formDescriptionId}
      className={"text-muted-foreground text-xs " + (className ?? "")}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error?.message ? String(error.message) : (props.children as string | undefined)

  if (!body) return null

  return (
    <p
      id={formMessageId}
      className={"text-destructive text-xs font-medium " + (className ?? "")}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
