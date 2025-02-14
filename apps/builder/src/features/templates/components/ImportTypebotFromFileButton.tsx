import { useToast } from '@/hooks/useToast'
import { readFile } from '@/utils/helpers'
import { Button, ButtonProps, chakra } from '@chakra-ui/react'
import { groupSchema, Typebot } from 'models'
import React, { ChangeEvent } from 'react'
import { z } from 'zod'

type Props = {
  onNewTypebot: (typebot: Typebot) => void
} & ButtonProps

export const ImportTypebotFromFileButton = ({
  onNewTypebot,
  ...props
}: Props) => {
  const { showToast } = useToast()

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files) return
    const file = e.target.files[0]
    const fileContent = await readFile(file)
    try {
      const typebot = JSON.parse(fileContent)
      z.array(groupSchema).parse(typebot.groups)
      onNewTypebot(typebot)
    } catch (err) {
      console.error(err)
      showToast({
        description: "Failed to parse the file. Are you sure it's a typebot?",
      })
    }
  }

  return (
    <>
      <chakra.input
        type="file"
        id="file-input"
        display="none"
        onChange={handleInputChange}
        accept=".json"
      />
      <Button as="label" htmlFor="file-input" cursor="pointer" {...props}>
        {props.children}
      </Button>
    </>
  )
}
