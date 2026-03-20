// src/sanity/schemaTypes/index.ts
import { projectSchema      } from './project';
import { experienceSchema   } from './experience';
import { skillGroupSchema   } from './skillGroup';
import { aboutSchema        } from './about';
import { corridorPhotoSchema } from './corridorPhoto';

export const schemaTypes = [
  projectSchema,
  experienceSchema,
  skillGroupSchema,
  aboutSchema,
  corridorPhotoSchema,
];