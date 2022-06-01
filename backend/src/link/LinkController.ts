import { LinkService } from '@link/LinkService'
import { validateUrl } from '@utils/validateUrl'
import { Request, Response } from 'express'
// import { validateUrl } from '@utils/validateUrl'

export class LinkController {
  constructor(private service: LinkService) {}

  handleNewShortUrl = async (req: Request, res: Response) => {
    const { url } = req.body

    if (!validateUrl(url)) {
      res.status(400).json({ message: 'Please provide a valid url' })
    }

    try {
      const { error, hash } = await this.service.shortenLink(url)
      if (error) {
        res.status(500).json({ error })
      }

      res.status(200).json({ hash })
    } catch (err) {
      res.status(500).json({ error: err })
    }
  }

  handleRedirect = async (req: Request, res: Response) => {
    try {
      const { hash } = req.params

      if (hash) {
        const originalUrl = await this.service.getLink(hash)
        if (originalUrl) {
          res.redirect(301, originalUrl)
        }
      }
      res.status(200).json({ message: 'It worked' })
    } catch (err) {
      res.status(404).json({ message: 'Invalid link' })
    }
  }
}
