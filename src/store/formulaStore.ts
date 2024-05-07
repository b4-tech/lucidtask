import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

interface FormulaElement {
  text: string;
  fromAutocomplete: boolean;
  isEditing: boolean;
  editableText: string;
}

interface FormulaState {
  formulas: number[];
  elements: { [formulaId: number]: FormulaElement[] };
  addFormula: () => void;
  setElements: (formulaId: number, elements: FormulaElement[]) => void;
  editElement: (formulaId: number, index: number, newElement: FormulaElement) => void;
}

export const useStore = create<FormulaState>(
  persist(
    (set, get) => ({
      formulas: [],
      elements: {},
      addFormula: () => {
        const newId = get().formulas.length + 1;
        set((state) => ({
          formulas: [...state.formulas, newId],
          elements: { ...state.elements, [newId]: [] },
        }));
      },
      setElements: (formulaId, elements) =>
        set((state) => ({ elements: { ...state.elements, [formulaId]: elements } })),
      editElement: (formulaId, index, newElement) =>
        set((state) => {
          const elements = state.elements[formulaId];
          return {
            elements: {
              ...state.elements,
              [formulaId]: [...elements.slice(0, index), newElement, ...elements.slice(index + 1)],
            },
          };
        }),
    }),
    {
      name: 'formula-storage',
    }
  ) as StateCreator<FormulaState, [], []>
);
