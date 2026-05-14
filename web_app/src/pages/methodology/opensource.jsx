import React from 'react';
import {
  Container,
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Code,
  Divider,
  UnorderedList,
  ListItem,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaGithub,
  FaPython,
  FaExternalLinkAlt,
  FaBook,
  FaCheck,
  FaUsers,
  FaCopy,
} from 'react-icons/fa';
import InnerHeading from '@/components/custom/InnerHeading';
import { getMdContent } from '@/libs/markdown';

const FeatureBox = ({ icon, title, description }) => (
  <Box p={4} borderLeft='4px solid' borderColor='blue.500' bg='gray.50' borderRadius='md'>
    <HStack spacing={3} mb={2}>
      <Icon as={icon} boxSize={6} color='blue.600' />
      <Text fontWeight='bold' fontSize='md'>
        {title}
      </Text>
    </HStack>
    <Text fontSize='sm' color='gray.700'>
      {description}
    </Text>
  </Box>
);

const OpenSourceCode = ({ pageData }) => {
  const handleGitHubClick = () => {
    window.open('https://github.com/EpiPandit/MLSDM', '_blank');
  };

  return (
    <Container maxW='container.lg' p={4}>
      <Box my={4}>
        <InnerHeading
          title="Open Source Code"
          kicker={pageData?.kicker}
          sub_title="Explore our MLSDM Python package for machine learning species distribution modeling"
        />
      </Box>

      {/* Main Package Showcase */}
      <VStack spacing={8} my={12} align='stretch'>
        {/* Hero Section */}
        <Box
          p={8}
          borderRadius='lg'
          boxShadow='lg'
          bg='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          color='white'
        >
          <VStack spacing={4} align='start'>
            <HStack spacing={3}>
              <Icon as={FaPython} boxSize={10} />
              <VStack align='start' spacing={0}>
                <Text fontSize='3xl' fontWeight='bold'>
                  MLSDM
                </Text>
                <Text fontSize='sm' opacity={0.9}>
                  Machine Learning Species Distribution Modeling
                </Text>
              </VStack>
            </HStack>

            <Divider borderColor='rgba(255,255,255,0.3)' />

            <Text fontSize='md' lineHeight='1.8'>
              A comprehensive Python package for spatial modeling of arenavirus distribution using advanced 
              machine learning techniques. Built to support epidemiological research and zoonotic risk assessment.
            </Text>

            <HStack spacing={3} pt={2}>
              <Button
                onClick={handleGitHubClick}
                colorScheme='whiteAlpha'
                leftIcon={<FaGithub />}
                size='lg'
                _hover={{ bg: 'rgba(255,255,255,0.2)' }}
              >
                View on GitHub
              </Button>
              <Button
                as='a'
                href='https://github.com/EpiPandit/MLSDM#documentation'
                isExternal
                colorScheme='whiteAlpha'
                variant='outline'
                leftIcon={<FaBook />}
                size='lg'
              >
                Documentation
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Key Features */}
        <Box>
          <Text fontSize='2xl' fontWeight='bold' mb={6}>
            Key Features
          </Text>
          <VStack spacing={4} align='stretch'>
            <FeatureBox
              icon={FaPython}
              title="Pure Python Implementation"
              description="Written entirely in Python with minimal dependencies. Easy to install and use in any environment."
            />
            <FeatureBox
              icon={FaCheck}
              title="Multiple ML Algorithms"
              description="Includes Random Forest, Extra Trees, XGBoost, and LightGBM for robust species distribution predictions."
            />
            <FeatureBox
              icon={FaBook}
              title="Comprehensive Documentation"
              description="Complete documentation with tutorials, examples, and API reference for all functions and classes."
            />
            <FeatureBox
              icon={FaUsers}
              title="Community-Driven Development"
              description="Open source with contributions welcome. Report issues, submit PRs, and help improve the package."
            />
          </VStack>
        </Box>

        {/* Installation Section */}
        <Box>
          <Text fontSize='2xl' fontWeight='bold' mb={4}>
            Installation
          </Text>
          <Box bg='gray.100' p={4} borderRadius='md' borderLeft='4px solid' borderColor='blue.500'>
            <Text fontSize='sm' color='gray.600' mb={2}>
              Install via pip:
            </Text>
            <Box
              bg='gray.800'
              color='green.300'
              p={3}
              borderRadius='md'
              fontFamily='mono'
              fontSize='sm'
              overflowX='auto'
            >
              pip install mlsdm
            </Box>
          </Box>
        </Box>

        {/* Quick Start */}
        <Box>
          <Text fontSize='2xl' fontWeight='bold' mb={4}>
            Quick Start
          </Text>
          <Box bg='gray.50' p={4} borderRadius='md' borderLeft='4px solid' borderColor='green.500'>
            <Text fontSize='sm' fontWeight='bold' mb={3}>
              Basic usage example:
            </Text>
            <Box
              bg='gray.900'
              color='gray.100'
              p={4}
              borderRadius='md'
              fontFamily='mono'
              fontSize='xs'
              overflowX='auto'
            >
              <Code
                d='block'
                whiteSpace='pre'
                color='green.300'
              >{`from mlsdm import SDModel
from sklearn.ensemble import RandomForestClassifier

# Load your data
X_train, y_train = load_training_data()
X_pred = load_prediction_data()

# Create and train model
model = SDModel(
  clf=RandomForestClassifier(n_estimators=100),
  feature_names=['temperature', 'precipitation', ...]
)
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_pred)
probability_map = model.predict_proba(X_pred)

# Evaluate performance
metrics = model.evaluate(X_test, y_test)
print(metrics)`}</Code>
            </Box>
          </Box>
        </Box>

        {/* Main Requirements */}
        <Box>
          <Text fontSize='2xl' fontWeight='bold' mb={4}>
            Requirements
          </Text>
          <Box p={4} bg='gray.50' borderRadius='md'>
            <UnorderedList spacing={2} ml={4}>
              <ListItem>
                <Text as='span' fontWeight='bold'>
                  Python 3.8+
                </Text>
              </ListItem>
              <ListItem>
                <Text as='span' fontWeight='bold'>
                  NumPy, Pandas
                </Text>
                {' — Data manipulation and numerical computing'}
              </ListItem>
              <ListItem>
                <Text as='span' fontWeight='bold'>
                  Scikit-learn
                </Text>
                {' — Machine learning algorithms'}
              </ListItem>
              <ListItem>
                <Text as='span' fontWeight='bold'>
                  GeoPandas, Rasterio
                </Text>
                {' — Geospatial data processing'}
              </ListItem>
              <ListItem>
                <Text as='span' fontWeight='bold'>
                  Matplotlib, Folium
                </Text>
                {' — Visualization'}
              </ListItem>
            </UnorderedList>
          </Box>
        </Box>

        {/* Contributing Section */}
        <Box
          p={6}
          borderRadius='lg'
          border='2px dashed'
          borderColor='blue.300'
          bg='blue.50'
        >
          <VStack align='start' spacing={3}>
            <HStack spacing={2}>
              <Icon as={FaUsers} boxSize={6} color='blue.600' />
              <Text fontSize='xl' fontWeight='bold'>
                Want to Contribute?
              </Text>
            </HStack>
            <Text fontSize='md' color='gray.700'>
              MLSDM is an open source project and welcomes contributions from the community. 
              Whether you want to fix bugs, add features, improve documentation, or suggest enhancements, 
              we'd love to hear from you!
            </Text>
            <Text fontSize='sm' color='gray.600'>
              Check out the{' '}
              <Text as='span' fontWeight='bold'>
                CONTRIBUTING.md
              </Text>
              {' '}file in the repository for guidelines on how to get started.
            </Text>
            <HStack spacing={3} pt={2}>
              <Button
                onClick={handleGitHubClick}
                colorScheme='blue'
                leftIcon={<FaGithub />}
              >
                View Repository
              </Button>
              <Button
                as='a'
                href='https://github.com/EpiPandit/MLSDM/issues'
                isExternal
                colorScheme='gray'
                variant='outline'
              >
                Report Issues
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Support & Resources */}
        <Box>
          <Text fontSize='2xl' fontWeight='bold' mb={4}>
            Support & Resources
          </Text>
          <VStack spacing={2} align='stretch'>
            <HStack
              p={3}
              bg='gray.50'
              borderRadius='md'
              cursor='pointer'
              _hover={{ bg: 'gray.100' }}
              as='a'
              href='https://github.com/EpiPandit/MLSDM/wiki'
              isExternal
            >
              <Icon as={FaBook} color='blue.600' />
              <Box flex={1}>
                <Text fontWeight='bold' fontSize='sm'>
                  Wiki & Tutorials
                </Text>
                <Text fontSize='xs' color='gray.600'>
                  Comprehensive guides and tutorials for users
                </Text>
              </Box>
              <Icon as={FaExternalLinkAlt} color='gray.400' fontSize='xs' />
            </HStack>

            <HStack
              p={3}
              bg='gray.50'
              borderRadius='md'
              cursor='pointer'
              _hover={{ bg: 'gray.100' }}
              as='a'
              href='https://github.com/EpiPandit/MLSDM/discussions'
              isExternal
            >
              <Icon as={FaUsers} color='blue.600' />
              <Box flex={1}>
                <Text fontWeight='bold' fontSize='sm'>
                  Discussions & Q&A
                </Text>
                <Text fontSize='xs' color='gray.600'>
                  Ask questions and discuss with the community
                </Text>
              </Box>
              <Icon as={FaExternalLinkAlt} color='gray.400' fontSize='xs' />
            </HStack>

            <HStack
              p={3}
              bg='gray.50'
              borderRadius='md'
              cursor='pointer'
              _hover={{ bg: 'gray.100' }}
              as='a'
              href='https://github.com/EpiPandit/MLSDM/issues'
              isExternal
            >
              <Icon as={FaCheck} color='blue.600' />
              <Box flex={1}>
                <Text fontWeight='bold' fontSize='sm'>
                  Issue Tracker
                </Text>
                <Text fontSize='xs' color='gray.600'>
                  Report bugs or request features
                </Text>
              </Box>
              <Icon as={FaExternalLinkAlt} color='gray.400' fontSize='xs' />
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export async function getStaticProps() {
  try {
    const pageData = await getMdContent('methodology.md', true);
    return {
      props: { pageData },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error loading methodology data:', error);
    return {
      props: { pageData: { title: 'Open Source Code' } },
      revalidate: 60,
    };
  }
}

export default OpenSourceCode;
