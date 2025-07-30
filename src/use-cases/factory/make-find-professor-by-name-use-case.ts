import { ProfessorRepository } from "@/repositories/pg/professor.repository";
import { FindProfessorByNameUseCase } from "../find-professor-by-name";

export function makeFindProfessorByNameUseCase() {
  const professorRepository = new ProfessorRepository();
  const findProfessorByNameUseCase = new FindProfessorByNameUseCase(
    professorRepository
  );

  return findProfessorByNameUseCase;
}
