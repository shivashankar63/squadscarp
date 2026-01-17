#!/usr/bin/env node

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Claude client
const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.error('❌ Error: ANTHROPIC_API_KEY not found in environment variables.');
  console.log('\n📝 To set up:');
  console.log('1. Create a .env file in the project root');
  console.log('2. Add: ANTHROPIC_API_KEY=your_api_key_here');
  console.log('3. Get your API key from: https://console.anthropic.com/\n');
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: apiKey,
});

// Get the prompt from command line arguments
const args = process.argv.slice(2);
const prompt = args.join(' ');

if (!prompt) {
  console.log('💬 Claude CLI - Ask Claude anything!\n');
  console.log('Usage: npm run claude "your question here"');
  console.log('   or: node claude-cli.js "your question here"\n');
  console.log('Examples:');
  console.log('  npm run claude "What is React?"');
  console.log('  npm run claude "Explain TypeScript generics"');
  console.log('  npm run claude "Help me debug this code"');
  process.exit(0);
}

// Make the API call
async function chatWithClaude() {
  try {
    console.log('🤖 Thinking...\n');
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract and display the response
    const response = message.content[0].text;
    console.log('✨ Claude:\n');
    console.log(response);
    console.log('\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.status === 401) {
      console.log('\n💡 Your API key might be invalid. Check your .env file.');
    }
    process.exit(1);
  }
}

chatWithClaude();
