import { z } from 'zod';

export const businessSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, 'La ville est requise'),
});

export type BusinessFormData = z.infer<typeof businessSchema>;