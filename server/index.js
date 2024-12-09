import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Routes pour les entreprises
app.get('/api/businesses', async (req, res) => {
  try {
    const businesses = await prisma.business.findMany({
      include: {
        category: true,
        reviews: true,
        services: true,
      },
    });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des entreprises' });
  }
});

app.post('/api/businesses', async (req, res) => {
  try {
    const business = await prisma.business.create({
      data: {
        name: req.body.name,
        categoryId: req.body.categoryId,
        address: req.body.address,
        city: req.body.city,
      },
      include: {
        category: true,
        reviews: true,
        services: true,
      },
    });
    res.json(business);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'entreprise' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});