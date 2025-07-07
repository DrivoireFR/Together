import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Congrats } from '../entities/Congrats';
import { Tag } from '../entities/Tag';

export class CongratsController {
  private congratsRepository = AppDataSource.getRepository(Congrats);
  private tagRepository = AppDataSource.getRepository(Tag);

  async getAll(req: Request, res: Response) {
    try {
      const congrats = await this.congratsRepository.find({
        relations: ['tag']
      });
      res.json(congrats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des congrats' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const congrats = await this.congratsRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['tag']
      });

      if (!congrats) {
        return res.status(404).json({ message: 'Congrats non trouvé' });
      }

      res.json(congrats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du congrats' });
    }
  }

  async getByTag(req: Request, res: Response) {
    try {
      const { tagId } = req.params;
      const congrats = await this.congratsRepository.find({
        where: { tag: { id: parseInt(tagId) } },
        relations: ['tag']
      });
      res.json(congrats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des congrats pour ce tag' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { level, message, tagId } = req.body;

      const tag = await this.tagRepository.findOne({
        where: { id: tagId }
      });

      if (!tag) {
        return res.status(404).json({ message: 'Tag non trouvé' });
      }

      const congrats = this.congratsRepository.create({
        level,
        message,
        tag
      });

      const savedCongrats = await this.congratsRepository.save(congrats);
      res.status(201).json(savedCongrats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création du congrats' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { level, message, tagId } = req.body;

      const congrats = await this.congratsRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!congrats) {
        return res.status(404).json({ message: 'Congrats non trouvé' });
      }

      if (tagId) {
        const tag = await this.tagRepository.findOne({
          where: { id: tagId }
        });
        if (!tag) {
          return res.status(404).json({ message: 'Tag non trouvé' });
        }
        congrats.tag = tag;
      }

      if (level) congrats.level = level;
      if (message) congrats.message = message;

      const updatedCongrats = await this.congratsRepository.save(congrats);
      res.json(updatedCongrats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du congrats' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.congratsRepository.delete(parseInt(id));

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Congrats non trouvé' });
      }

      res.json({ message: 'Congrats supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du congrats' });
    }
  }
}