const fs = require('fs');
const path = require('path');
const srcDir = 'c:/Users/anush/Desktop/SignAI/Frontend/my-app/src';

const fixPlacement = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Pattern to catch BackButton before header
    const regex = /(<BackButton[^>]+>)\s*<header([^>]*)>/g;
    if (regex.test(content)) {
        content = content.replace(regex, '<header$2>\n                $1');
        fs.writeFileSync(filePath, content);
        console.log('Fixed ' + path.basename(filePath));
    }
};

const components = [
    'AlphabetModuleOne', 'AlphabetModuleTwo', 'AlphabetModuleThree', 'AlphabetModuleFour', 'AlphabetModuleFive', 'NumbersModule',
    'AlphabetQuizOne', 'AlphabetQuizTwo', 'AlphabetQuizThree', 'AlphabetQuizFour', 'AlphabetQuizFive', 'AlphabetQuizMaster', 'NumbersQuiz'
];

components.forEach(mod => {
    fixPlacement(path.join(srcDir, 'components', mod + '.jsx'));
});

fixPlacement(path.join(srcDir, 'pages/AlphabetQuizMap.jsx'));
