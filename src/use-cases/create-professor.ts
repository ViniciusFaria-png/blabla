import { Professor } from "@/entities/professor.entity";
import { IProfessorRepository } from "../repositories/professor.repository.interface";

export class CreateProfessorUseCase {
  constructor(private readonly professorRepository: IProfessorRepository) {}

  async handler(professor: Professor): Promise<Professor> {
    return this.professorRepository.create(professor);
  }
}
