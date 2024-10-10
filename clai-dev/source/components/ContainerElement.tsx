import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import React from 'react';

function ContainerElement({ children }: { children: any }) {
      return (
            <Box flexDirection="row" gap={5}>
                  <Box flexDirection="column" width={'70%'}>
                        <Gradient name="fruit">
                              <BigText text="CLAI" />
                        </Gradient>
                        <Text>
                              Speak? Text? Tamil? We understand everything, would do anything you'd like. We Put The A In The CLI
                        </Text>
                  </Box>
                  <Box justifyContent="center" flexDirection="column">
                        {children}
                  </Box>
            </Box>
      );
}

export default ContainerElement;