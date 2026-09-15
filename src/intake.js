// Step Navigation with Custom Validation
function nextStep() {
    const name = document.getElementById('leadName').value.trim();
    const email = document.getElementById('leadEmail').value.trim();
    
    if (!name) {
        alert("Please enter your name.");
        return;
    }
    
    if (!email || !email.includes('@') || !email.includes('.')) {
        alert("Please enter a valid email address.");
        return;
    }
    
    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-2').classList.add('active');
}

function prevStep() {
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
}

// Form Submission Handler
document.getElementById('arjumandLeadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const message = document.getElementById('leadMessage').value.trim();
    if (!message) {
        alert("Please tell me about your project before submitting.");
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    // 1. Check Honeypot Trap
    const trap = document.getElementById('website_url').value;
    if (trap !== "") {
        console.warn("Spambot detected. Silently dropping payload.");
        submitBtn.innerText = "Request Sent!"; // Lie to the bot
        return; 
    }

    // 2. Gather Data
    const payload = {
        name: document.getElementById('leadName').value,
        email: document.getElementById('leadEmail').value,
        message: document.getElementById('leadMessage').value,
        timestamp: new Date().toLocaleString()
    };
    
    // 3. Construct Discord Embed Payload
    const DISCORD_WEBHOOK_URL = "YOUR_DISCORD_URL_HERE"; // Replace with your actual Discord webhook URL

    const discordData = {
        content: "🚀 **New Lead for Arjumand Labs!**",
        embeds: [{
            title: "Project Inquiry",
            color: 50256, 
            fields: [
                { name: "Name", value: payload.name, inline: true },
                { name: "Email", value: payload.email, inline: true },
                { name: "Message", value: payload.message }
            ],
            footer: { text: "Serverless Intake Engine • " + payload.timestamp }
        }]
    };

    // 4. Fire the Webhook
    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discordData)
        });

        if (response.ok) {
            submitBtn.innerText = "Request Sent!";
            submitBtn.style.background = "#00FF66"; // Green success state
            submitBtn.style.color = "black";
        } else {
            throw new Error("Webhook failed");
        }
    } catch (error) {
        console.error("Error sending lead:", error);
        submitBtn.innerText = "Error. Try Again.";
        submitBtn.disabled = false;
    }
});