import React, { useState } from "react";
import { render, Box, Text } from "ink";
import Select from "ink-select-input";
import SearchQuery from './SearchQuery.js';
import TranscribeComponent from "./voiceToText.js";
import GenerateAndSave from "./components/generateAndSave.js";

interface Feature {
	value: string;
}

const App = () => {
	const [feature, setFeature] = useState<Feature | null>(null); // Feature or null
	const [, , filename, duration] = process.argv;
	const texttoinp = "hi bro!! how r u";

	if (feature?.value === "text-command") { // Use optional chaining
		return (
			<SearchQuery
				onSubmit={(query: string) => { // Specify query type as string
					return console.log("User query:", query);
				}}
			/>
		);
	}

	return (
		<Box flexDirection="column">
			<Text>Choose an option:</Text>
			<Select
				items={[
					{ label: "Text Command", value: "text-command" },
					{ label: "Voice Command", value: "voice-command" },
					{ label: "Help", value: "help" },
					{ label: "Exit", value: "exit" }, // Remove extra space
				]}
				onSelect={(item) => {
					setFeature(item);
					if (item.value === "exit") {
						 process.exit();
					}
					else if(item.value === "voice-command") { 
						render(<TranscribeComponent />);
					}
					

				}}
			/>
			
			{/* <GenerateAndSave text={texttoinp} /> */}

		</Box>
	);
};

render(<App />);

export default App;