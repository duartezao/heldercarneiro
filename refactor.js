const fs = require('fs');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.startsWith('project-'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

  // Replace Nav
  content = content.replace(/<nav[\s\S]*?<\/nav>/, '<div id="navbar-container"></div>');
  
  // Replace Footer
  content = content.replace(/<footer[\s\S]*?<\/footer>/, '<div id="footer-container"></div>');

  // Add components.js script if not there
  if (!content.includes('js/components.js')) {
    content = content.replace('</body>', '  <script src="js/components.js"></script>\n</body>');
  }

  // Specific for projects.html
  if (file === 'projects.html') {
    // Replace the grid of projects
    content = content.replace(
      /<div class="grid md:grid-cols-2 gap-6 md:gap-8">[\s\S]*?<!-- Project 4 -->[\s\S]*?<\/div>\s*<\/div>/, 
      '<div id="projects-grid" class="grid md:grid-cols-2 gap-6 md:gap-8"></div>'
    );
    
    // Add projects.js script if not there
    if (!content.includes('js/projects.js')) {
      content = content.replace('</body>', '  <script src="js/projects.js"></script>\n</body>');
    }
  }

  fs.writeFileSync(file, content, 'utf-8');
}

console.log("Refactoring complete");
