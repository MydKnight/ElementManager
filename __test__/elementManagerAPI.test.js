const mockAxios = require('jest-mock-axios'); // Import mock-axios
const { createJWT, getToken } = require('../elementManagerAPI'); // Import the createJWT function
require('dotenv').config();

describe('createJWT', () => {
    it('should generate a JWT token for the user', () => {
        // Mock user object
        const user = {
            user: process.env.sourceUser,
        };

        // Generate JWT token
        const token = createJWT(user);

        // Check if the token is a string
        expect(typeof token.token).toBe('string');
    });
});

describe('getToken', () => {
    it('should make a GET request and return a token', async () => {
        // Mock user object
        const user = {
            user: process.env.sourceUser,
        };

        // Mock JWT token
        const jwtToken = createJWT(user);

        // Mock response from the API
        const mockResponse = { data: 'mockToken' };
        mockAxios.get.mockResolvedValueOnce(mockResponse);

        // Call the function and check if it returns the mock token
        const token = await getToken(user);
        expect(token).toBe(mockResponse.data);

        // Check if axios.get was called correctly
        expect(mockAxios.get).toHaveBeenCalledWith(
            process.env.sourceSite + '/AgentWeb/api/elementmanager/authentication/authToken',
            {
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                    'OSvC-CREST-Application-Context': process.env.sourceInterface
                }
            }
        );
    });
});