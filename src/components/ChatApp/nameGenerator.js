const firstNames = [
    'Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry',
    'Isabella', 'Jack', 'Katherine', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter',
    'Quinn', 'Rachel', 'Samuel', 'Taylor', 'Uma', 'Victor', 'Wendy', 'Xavier',
    'Yara', 'Zack'
];

const lastNames = [
    'Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris',
    'Ibrahim', 'Johnson', 'King', 'Lee', 'Miller', 'Nelson', 'O\'Connor', 'Parker',
    'Quinn', 'Robinson', 'Smith', 'Taylor', 'Upton', 'Vincent', 'Walker', 'Xavier',
    'Young', 'Zhang'
];

export const generateAgentName = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const initials = firstName.charAt(0) + lastName.charAt(lastName.length - 1);
    return {
        fullName: `${firstName} ${lastName}`,
        initials: initials
    };
}; 