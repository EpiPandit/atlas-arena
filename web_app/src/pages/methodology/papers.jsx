import React, { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Badge,
  Link,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Code,
  useClipboard,
  Icon,
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaCopy, FaCheck } from 'react-icons/fa';
import InnerHeading from '@/components/custom/InnerHeading';
import { getMdContent } from '@/libs/markdown';
import { FEATURED_PAPERS, BIBTEX_CITATIONS } from '@/config/constants/papers';

const PaperCard = ({ paper, onViewDetails }) => (
  <Box
    borderRadius='lg'
    overflow='hidden'
    boxShadow='md'
    transition='all 0.3s'
    _hover={{ boxShadow: 'lg', transform: 'translateY(-4px)' }}
    bg='white'
    display='flex'
    flexDirection='column'
    h='100%'
  >
    <Box
      h='200px'
      bg='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      display='flex'
      alignItems='center'
      justifyContent='center'
      p={4}
    >
      <VStack spacing={2} align='center' justify='center'>
        <Text fontSize='sm' fontWeight='bold' color='white' textAlign='center' noOfLines={3}>
          {paper.journal}
        </Text>
        <Text fontSize='xs' color='gray.100'>
          Vol. {paper.volume}, Issue {paper.issue} · {paper.year}
        </Text>
      </VStack>
    </Box>

    <VStack align='start' p={4} spacing={3} flex={1}>
      <VStack align='start' spacing={2} flex={1}>
        <Text fontWeight='bold' fontSize='md' lineHeight='1.5' noOfLines={3}>
          {paper.title}
        </Text>

        <Text fontSize='sm' color='gray.600' noOfLines={2}>
          {paper.authors.slice(0, 3).join(', ')}
          {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
        </Text>
      </VStack>

      <HStack wrap='wrap' spacing={2}>
        {paper.keywords.slice(0, 2).map((keyword) => (
          <Badge key={keyword} colorScheme='blue' fontSize='xs'>
            {keyword}
          </Badge>
        ))}
      </HStack>

      <HStack spacing={2} pt={2} w='full'>
        <Link
          href={paper.url}
          isExternal
          flex={1}
        >
          <Button
            size='sm'
            colorScheme='blue'
            variant='solid'
            w='full'
            rightIcon={<FaExternalLinkAlt />}
          >
            Read Paper
          </Button>
        </Link>
        <Button
          size='sm'
          variant='outline'
          colorScheme='gray'
          w='fit-content'
          onClick={() => onViewDetails(paper)}
        >
          Details
        </Button>
      </HStack>
    </VStack>
  </Box>
);

const PaperDetailsModal = ({ paper, isOpen, onClose }) => {
  const { hasCopied, onCopy } = useClipboard(BIBTEX_CITATIONS[paper.id]);

  if (!paper) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{paper.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack align='start' spacing={4}>
            <Box>
              <Text fontWeight='bold' fontSize='sm' color='gray.600' mb={1}>
                Authors
              </Text>
              <Text fontSize='sm'>{paper.authors.join(', ')}</Text>
            </Box>

            <Box>
              <Text fontWeight='bold' fontSize='sm' color='gray.600' mb={1}>
                Journal Information
              </Text>
              <Text fontSize='sm'>
                {paper.journal}, Volume {paper.volume}, Issue {paper.issue}, Pages {paper.pages}
              </Text>
              <Text fontSize='sm' color='gray.600'>
                {paper.year} · {paper.publisher}
              </Text>
            </Box>

            <Box>
              <Text fontWeight='bold' fontSize='sm' color='gray.600' mb={1}>
                Description
              </Text>
              <Text fontSize='sm'>{paper.description}</Text>
            </Box>

            <Box>
              <Text fontWeight='bold' fontSize='sm' color='gray.600' mb={2}>
                BibTeX Citation
              </Text>
              <Box
                bg='gray.100'
                p={3}
                borderRadius='md'
                position='relative'
                fontSize='xs'
                overflowX='auto'
              >
                <Code
                  p={2}
                  bg='transparent'
                  whiteSpace='pre-wrap'
                  wordBreak='break-word'
                  fontFamily='mono'
                >
                  {BIBTEX_CITATIONS[paper.id]}
                </Code>
                <Button
                  size='xs'
                  position='absolute'
                  top={2}
                  right={2}
                  onClick={onCopy}
                  leftIcon={hasCopied ? <FaCheck /> : <FaCopy />}
                  colorScheme={hasCopied ? 'green' : 'gray'}
                >
                  {hasCopied ? 'Copied!' : 'Copy'}
                </Button>
              </Box>
            </Box>

            <Link href={paper.url} isExternal w='full'>
              <Button
                colorScheme='blue'
                w='full'
                rightIcon={<FaExternalLinkAlt />}
              >
                Read Full Paper
              </Button>
            </Link>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const Papers = ({ pageData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPaper, setSelectedPaper] = useState(null);

  const handleViewDetails = (paper) => {
    setSelectedPaper(paper);
    onOpen();
  };

  return (
    <Container maxW='container.lg' p={4}>
      <Box my={4}>
        <InnerHeading
          title="Research Papers"
          kicker={pageData?.kicker}
          sub_title="Highlighted publications on arenavirus modeling and climate change impacts"
        />
      </Box>

      <VStack spacing={6} my={8} align='start'>
        <Text fontSize='md' color='gray.700'>
          Our research explores the intersection of climate change, spatial modeling, and arenavirus distribution across South America. 
          Below are our key publications on this topic.
        </Text>

        <Grid
          templateColumns={{ base: '1fr', md: '1fr', lg: '2fr' }}
          gap={6}
          w='full'
        >
          {FEATURED_PAPERS.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onViewDetails={handleViewDetails}
            />
          ))}
        </Grid>
      </VStack>

      {selectedPaper && (
        <PaperDetailsModal
          paper={selectedPaper}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </Container>
  );
};

export async function getStaticProps() {
  try {
    const pageData = await getMdContent('methodology.md', true);
    return {
      props: { pageData },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error loading methodology data:', error);
    return {
      props: { pageData: { title: 'Research Papers' } },
      revalidate: 60,
    };
  }
}

export default Papers;
