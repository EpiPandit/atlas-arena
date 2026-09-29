import { FormLabel, Flex, Heading } from '@chakra-ui/react';
import InfoTooltip from '@/components/custom/InfoTooltip';

// Filter-panel section title, exposed as an <h2> so screen-reader users can
// navigate the panel by heading. The info button sits beside (not inside)
// the heading/label so it doesn't leak into the control's accessible name.
//
// - Single controls (select): renders a <label> inside the heading, bound to
//   the FormControl's field id.
// - Groups (radios, checkboxes): pass `id` and reference it from the group
//   container via aria-labelledby instead of a for-based <label>.
const FormLabelFlex = ({
  label,
  info,
  id,
  isGroup = false,
  isDisabled = false,
}) => {
  if (!label) return null;
  return (
    <Flex justifyContent='space-between' alignItems='center' mb={2}>
      <Heading
        as='h2'
        id={id}
        fontSize='sm'
        fontWeight={700}
        lineHeight='short'
        textTransform='uppercase'
        opacity={isGroup && isDisabled ? 0.4 : 1}
      >
        {isGroup ? (
          label
        ) : (
          <FormLabel m={0} fontSize='inherit' fontWeight='inherit'>
            {label}
          </FormLabel>
        )}
      </Heading>
      <InfoTooltip label={info} name={label} />
    </Flex>
  );
};
export default FormLabelFlex;
