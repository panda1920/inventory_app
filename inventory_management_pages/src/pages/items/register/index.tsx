import withAuth from '@/components/hoc/with-auth/withAuth'
import { withServerSideHooks } from '@/helper/serverside-hooks'
import { Typography, useTheme } from '@mui/material'

function RegisterItem() {
  const theme = useTheme()
  return (
    <section
      className={`ms-[auto] me-[auto] flex flex-col`}
      style={{ width: `min(1000px, 100% - ${theme.spacing(2)})`, gap: theme.spacing(4) }}
    >
      <Typography variant='h3' className='text-center' style={{ marginBlock: theme.spacing(2) }}>
        Register Item
      </Typography>
    </section>
  )
}

export default withAuth(RegisterItem)

export const getServerSideProps = withServerSideHooks(async (context) => {
  // unauthenticated
  if (!context.user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  return {
    props: {},
  }
})
