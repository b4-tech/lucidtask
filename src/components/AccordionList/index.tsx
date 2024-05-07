import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useStore } from '@/store/formulaStore';

import FormulaInput from '../FormulaInput';

const AccordionList = () => {
  const { formulas } = useStore();

  return (
    <>
      {formulas.map((formulaId) => (
        <Accordion key={formulaId}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Formula {formulaId}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormulaInput formulaId={formulaId} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default AccordionList;
