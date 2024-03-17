import { Select } from "@inkjs/ui";
import React, { useState } from "react";
import { render, Box, Text } from 'ink';
import ContainerElement from "./components/ContainerElement.js";
import TextInput from 'ink-text-input';
// import VoiceInput from "./voiceToText.js";



export default function App() {
	const [feature, setFeature] = useState("");
	if (feature == 'text-command') {
		render(<SearchQuery />);
	}
	else if (feature == 'voice-command') {

	}




	return (
		<ContainerElement>
			<Select
				options={[
					{ label: 'Text Command', value: 'text-command' },
					{ label: 'Voice Command', value: 'voice-command' },
					{ label: 'Help', value: 'help' },
					{ label: 'Exit', value: 'exit' },
				]}
				onChange={value => {
					setFeature(value);
					if (value === 'exit') process.exit();
				}}
			/>
		</ContainerElement>

	)
}

const SearchQuery = () => {
	const [query, setQuery] = useState('');

	return (
		<Box>
			<Box marginRight={1}>
				<Text>Enter your query:</Text>
			</Box>

			<TextInput value={query} onChange={setQuery} />
		</Box>
	);
};