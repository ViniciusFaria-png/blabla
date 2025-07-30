import { ProfessorRepository } from "@/repositories/pg/professor.repository";
import { CreateProfessorUseCase } from "../create-professor";

export function makeCreateProfessorUseCase() {
  const professorRepository = new ProfessorRepository();
  const createProfessorUseCase = new CreateProfessorUseCase(professorRepository);
  return createProfessorUseCase;
}
