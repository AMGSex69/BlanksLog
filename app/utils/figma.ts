import { Figma } from 'figma-api';

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = 'eXjgt0jQDCKUfIhYp1Hlaw';

export async function getFigmaDesign() {
	if (!FIGMA_ACCESS_TOKEN) {
		throw new Error('Figma access token is required');
	}

	const figma = new Figma({ personalAccessToken: FIGMA_ACCESS_TOKEN });

	try {
		// Get the file data
		const file = await figma.file(FILE_KEY);

		// Get the specific frame/artboard (node-id=2-2 from your URL)
		const posterFrame = file.document.children.find(
			child => child.id === '2:2'
		);

		if (!posterFrame) {
			throw new Error('Poster frame not found');
		}

		// Extract design tokens
		const designTokens = {
			colors: {
				border: posterFrame.backgroundColor,
				// Add other colors as needed
			},
			typography: {
				// Extract typography styles
			},
			spacing: {
				// Extract spacing values
			},
			// Add other design tokens as needed
		};

		return designTokens;
	} catch (error) {
		console.error('Error fetching Figma design:', error);
		throw error;
	}
} 