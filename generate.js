const fs = require("fs");
const csv = require("csv-parser");
const { execSync } = require("child_process");
const path = require("path");

const results = [];
const buildRoot = path.join(__dirname, "build");
if (!fs.existsSync(buildRoot)) fs.mkdirSync(buildRoot);

// Hero section options
const heroWords = ["Quick", "Fast", "Speedy"];

fs.createReadStream("websites.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    for (const site of results) {
      const { domain, phone, address } = site;
      const appPath = path.join(buildRoot, domain);

      // Random hero word
      const randomWord =
        heroWords[Math.floor(Math.random() * heroWords.length)];

      // If app doesn't exist, create fresh React app directly in /build/domain
      if (!fs.existsSync(appPath)) {
        console.log(`\nCreating React app for: ${domain}`);

        execSync(`npx create-react-app "${appPath}"`, {
          stdio: "inherit",
          shell: true,
        });
      }

      // Overwrite App.js with styled Hero + Contact section
      const appCode = `
        import React from "react";

        function App() {
          return (
            <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", textAlign: "center" }}>
              
              {/* Hero Section */}
              <section
                style={{
                  background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
                  color: "#fff",
                  padding: "80px 20px",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                ${randomWord} delivery service in Dhaka
              </section>

              {/* Contact Section */}
              <section
                style={{
                  marginTop: "40px",
                  display: "inline-block",
                  background: "#f5f5f5",
                  padding: "20px 40px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <p style={{ margin: "10px 0", fontSize: "1.2rem" }}>
                  📞 ${phone}
                </p>
                <p style={{ margin: "10px 0", fontSize: "1.2rem" }}>
                  🏠 ${address}
                </p>
              </section>
            </div>
          );
        }

        export default App;
      `;
      fs.writeFileSync(path.join(appPath, "src", "App.js"), appCode);

      console.log(`App ready at /build/${domain} (Hero: ${randomWord})`);
    }

    console.log(
      "\nAll apps generated. Go into any /build/<domain> folder and run: npm start"
    );
  });
