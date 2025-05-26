document.getElementById('image').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const displayImage = document.getElementById('displayImage');
            displayImage.src = e.target.result;
            displayImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('createCaseForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        location: document.getElementById('location').value,
        goal: parseFloat(document.getElementById('goal').value),
        deadline: document.getElementById('deadline').value,
        isApproved: false
    };

    try {
        const response = await fetch('http://localhost:4000/cases?isApproved=true', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Case created successfully!');
            window.location.href = 'cases.html';
        } else {
            throw new Error('Failed to create case');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create case. Please try again.');
    }
});
