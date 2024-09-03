import { EnqueueSnackbar, useSnackbar } from 'notistack'

/**
 * Hook that provides simplified api to use notistack
 */
export function useToast() {
  const { enqueueSnackbar } = useSnackbar()

  // extract the option type of enqueuesnackbar() minus the variant key
  type OptionType = Omit<Exclude<Parameters<EnqueueSnackbar>[1], undefined>, 'variant'>

  const toastSuccess = (msg: string, option?: OptionType) => {
    enqueueSnackbar(msg, { ...option, variant: 'success' })
  }
  const toastInfo = (msg: string, option?: OptionType) => {
    enqueueSnackbar(msg, { ...option, variant: 'info' })
  }
  const toastError = (msg: string, option?: OptionType) => {
    enqueueSnackbar(msg, { ...option, variant: 'error' })
  }

  return { toastSuccess, toastInfo, toastError }
}
