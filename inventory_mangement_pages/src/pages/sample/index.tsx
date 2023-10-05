import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import { Card, Container, Grid, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'

import styles from './index.module.css'

export default function Sample() {
  return (
    <Box component='main' className={styles.main}>
      <Container>
        <Card variant='outlined'>
          <Box
            component='div'
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TextSnippetIcon /> Box1
          </Box>
        </Card>
        <Card variant='outlined'>
          <Box
            component='div'
            sx={{
              display: 'flex',
              flexDirection: 'roq',
              alignItems: 'center',
            }}
          >
            <TextSnippetIcon /> Box2
          </Box>
        </Card>
        <Card variant='outlined'>
          <Box
            component='div'
            sx={{
              display: 'flex',
              flexDirection: 'roq',
              alignItems: 'center',
            }}
          >
            <TextSnippetIcon /> Box3
          </Box>
        </Card>
        <Card variant='outlined'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'roq',
              alignItems: 'center',
            }}
            component='div'
          >
            <TextSnippetIcon fontSize='large' /> Box4
          </Box>
        </Card>
      </Container>
      <Container>
        <Grid container spacing={1}>
          <Grid xs={4} item>
            <Paper elevation={2} className={styles.gridItem}>
              <Typography variant='h5' component='p'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, aliquid.
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={4} item>
            <Paper elevation={2} className={styles.gridItem}>
              <Typography variant='h5' component='p'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, aliquid.
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={4} item>
            <Paper elevation={2} className={styles.gridItem}>
              <Typography variant='h5' component='p'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, aliquid.
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={4} item>
            <Paper elevation={2} className={styles.gridItem}>
              <Typography variant='h5' component='p'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, aliquid.
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={4} item>
            <Paper elevation={2} className={styles.gridItem}>
              <Typography variant='h5' component='p'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, aliquid.
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={4} item>
            <Paper elevation={2} className={styles.gridItem}>
              <Typography variant='h5' component='p'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, aliquid.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
