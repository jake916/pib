export interface Project {
    id: string;
    title: string;
    lga: string;
    status: 'Ongoing' | 'Completed' | 'Planned';
    category: 'Infrastructure' | 'Education' | 'Health' | 'Agriculture' | 'Water';
    description: string;
    startDate: string;
    completionDate?: string;
    image?: string;
}

export const dummyProjects: Project[] = [
    {
        id: '1',
        title: 'Aba Smart School Initiative',
        lga: 'Aba North',
        status: 'Ongoing',
        category: 'Education',
        description: 'Comprehensive infrastructure upgrade and renovation project to transform Aba schools into modern centers of excellence.',
        startDate: '2025-01-15',
        image: '/aba-smart-school.png'
    },
    {
        id: '2',
        title: 'Umuahia General Hospital Upgrade',
        lga: 'Umuahia North',
        status: 'Ongoing',
        category: 'Health',
        description: 'Full-scale renovation of the emergency ward and installation of state-of-the-art diagnostic equipment.',
        startDate: '2024-11-20',
        image: '/umuahia-hospital.png'
    },
    {
        id: '3',
        title: 'Rural Access Road Network',
        lga: 'Bende',
        status: 'Ongoing',
        category: 'Infrastructure',
        description: 'Construction of 45km of rural access roads to connect agricultural communities to major markets.',
        startDate: '2025-02-10',
        image: '/rural-access-road.png'
    },
    {
        id: '4',
        title: 'Ohafia Water Scheme Restoration',
        lga: 'Ohafia',
        status: 'Planned',
        category: 'Water',
        description: 'Rehabilitation of the Ohafia water treatment plant and expansion of the distribution network.',
        startDate: '2025-06-01'
    },
    {
        id: '5',
        title: 'Arochukwu Heritage Road',
        lga: 'Arochukwu',
        status: 'Ongoing',
        category: 'Infrastructure',
        description: 'Dualization of the main access road to Arochukwu to boost tourism and trade.',
        startDate: '2024-09-15'
    },
    {
        id: '6',
        title: 'Isiala Ngwa Industrial Park',
        lga: 'Isiala Ngwa North',
        status: 'Planned',
        category: 'Infrastructure',
        description: 'Development of a world-class industrial park to attract investors and create jobs.',
        startDate: '2025-08-20'
    },
    {
        id: '7',
        title: 'Ikwuano Agricultural Hub',
        lga: 'Ikwuano',
        status: 'Ongoing',
        category: 'Agriculture',
        description: 'Establishment of a modern agricultural hub for mechanized farming and processing.',
        startDate: '2025-03-05'
    },
    {
        id: '8',
        title: 'Umunneochi Security Post Expansion',
        lga: 'Umu Nneochi',
        status: 'Completed',
        category: 'Infrastructure',
        description: 'Construction of additional security outposts to improve safety along the state boundaries.',
        startDate: '2024-05-10',
        completionDate: '2025-01-20'
    },
    {
        id: '9',
        title: 'Osisioma Flyover Maintenance',
        lga: 'Osisioma Ngwa',
        status: 'Completed',
        category: 'Infrastructure',
        description: 'Regular maintenance and lighting installation on the Osisioma flyover.',
        startDate: '2024-10-01',
        completionDate: '2024-12-15'
    },
    {
        id: '10',
        title: 'Obi Ngwa Primary Health Centers',
        lga: 'Obi Ngwa',
        status: 'Ongoing',
        category: 'Health',
        description: 'Renovation and equipping of 5 primary health centers across the LGA.',
        startDate: '2025-01-30'
    }
];
