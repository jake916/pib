export interface BlogArticle {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    date: string;
    category: string;
    readTime: string;
}

export const blogArticles: BlogArticle[] = [
    {
        id: 1,
        slug: 'transforming-abia-infrastructure',
        title: 'Transforming Abia: Major Infrastructure Projects Underway',
        excerpt: 'An overview of the ongoing infrastructure development projects across Abia State, bringing modern roads and connectivity to communities.',
        content: `
# Transforming Abia: Major Infrastructure Projects Underway

The Project Implementation Bureau is overseeing several transformative infrastructure projects across Abia State, marking a new era of development and connectivity.

## Road Network Expansion

Our road construction initiative is connecting previously isolated communities to major economic centers. The project includes:

- **120 kilometers** of new asphalt roads
- **45 bridges** and culverts for improved drainage
- **Street lighting** installations for enhanced safety
- **Pedestrian walkways** in urban areas

## Impact on Communities

These infrastructure improvements are already showing significant benefits:

- Reduced travel time by up to 40%
- Improved access to markets and healthcare facilities
- Enhanced safety for commuters
- Increased property values in connected areas

## Timeline and Progress

The project is currently 65% complete, with an expected completion date of Q4 2026. Our monitoring team conducts weekly site inspections to ensure quality standards and timely delivery.

## Community Feedback

Local residents have expressed overwhelming support for these projects. Chief Okafor from Umuahia stated: "This road has transformed our community. Our children can now get to school safely, and farmers can transport their goods to market without difficulty."

The PIB remains committed to transparent project delivery and regular community engagement throughout the implementation process.
        `,
        image: '/blog_infrastructure_development_1770457608929.png',
        author: 'PIB Communications',
        date: 'February 5, 2026',
        category: 'Infrastructure',
        readTime: '5 min read'
    },
    {
        id: 2,
        slug: 'digital-transformation-tech-hub',
        title: 'Digital Transformation: Abia State Technology Hub Opens',
        excerpt: 'The new technology and innovation center is empowering young Nigerians with digital skills and creating opportunities in the tech sector.',
        content: `
# Digital Transformation: Abia State Technology Hub Opens

The Abia State Technology Hub officially opened its doors this month, representing a major milestone in the state's digital transformation agenda.

## World-Class Facilities

The hub features:

- **200-seat co-working space** with high-speed internet
- **Training rooms** equipped with modern computers
- **Innovation labs** for prototyping and development
- **Meeting spaces** for collaboration and networking

## Programs and Initiatives

The hub offers various programs designed to build digital capacity:

### Skills Training
- Web development bootcamps
- Data science courses
- Digital marketing workshops
- Mobile app development

### Startup Support
- Mentorship programs
- Access to funding opportunities
- Business development resources
- Networking events

## Economic Impact

Since opening, the hub has:

- Trained over **500 young people** in digital skills
- Supported **30 tech startups**
- Created **150 direct jobs**
- Attracted **₦200 million** in tech investments

## Future Plans

The PIB is working to establish satellite hubs in three additional locations across Abia State by 2027, ensuring broader access to digital opportunities.

"This hub is not just about technology—it's about creating opportunities and transforming lives," said the Director General during the opening ceremony.
        `,
        image: '/blog_technology_innovation_1770457624548.png',
        author: 'PIB Communications',
        date: 'January 28, 2026',
        category: 'Technology',
        readTime: '4 min read'
    },
    {
        id: 3,
        slug: 'community-engagement-development',
        title: 'Community Engagement: Building Projects Together',
        excerpt: 'How the PIB is ensuring community voices are heard in project planning and implementation across Abia State.',
        content: `
# Community Engagement: Building Projects Together

The Project Implementation Bureau believes that successful development requires active community participation. Our community engagement model ensures that projects reflect the real needs of the people they serve.

## Our Engagement Approach

We employ a multi-faceted approach to community engagement:

### Town Hall Meetings
Regular forums where community members can:
- Learn about proposed projects
- Ask questions and raise concerns
- Provide input on project design
- Monitor implementation progress

### Community Liaisons
We've appointed local representatives in each project area to:
- Facilitate communication between PIB and residents
- Gather feedback and suggestions
- Report on project impact
- Ensure transparency

## Recent Success Stories

### Umuahia Water Project
Community input led to the addition of:
- 5 extra water points in underserved areas
- Extended pipeline to reach remote households
- Training for local maintenance teams

### Aba Market Renovation
Trader associations helped design:
- Improved stall layouts
- Better waste management systems
- Enhanced security features
- Accessible facilities for persons with disabilities

## Measuring Impact

Our engagement efforts have resulted in:

- **95% community satisfaction** with completed projects
- **Zero major conflicts** during implementation
- **30% faster** project approval processes
- **Higher utilization** of completed facilities

## Looking Forward

The PIB is committed to deepening community engagement through:
- Digital feedback platforms
- Youth participation programs
- Women's empowerment initiatives
- Regular project updates and reports

Together, we're building an Abia State that works for everyone.
        `,
        image: '/blog_community_engagement_1770457641222.png',
        author: 'PIB Communications',
        date: 'January 20, 2026',
        category: 'Community',
        readTime: '6 min read'
    },
    {
        id: 4,
        slug: 'education-infrastructure-schools',
        title: 'Investing in Education: New Schools and Renovations',
        excerpt: 'The PIB is overseeing the construction of modern educational facilities and renovation of existing schools across Abia State.',
        content: `
# Investing in Education: New Schools and Renovations

Education is the foundation of development. The PIB is implementing a comprehensive education infrastructure program to provide quality learning environments for Abia State's children.

## New School Construction

We're building **15 new schools** across the state, featuring:

- Modern classrooms with proper ventilation and lighting
- Science and computer laboratories
- Libraries and reading rooms
- Sports facilities
- Safe water and sanitation facilities

## School Renovation Program

Over **50 existing schools** are being renovated with:

- Roof repairs and waterproofing
- New furniture and equipment
- Electrical installations
- Playground improvements
- Accessibility features

## Impact on Learning

Early results show significant improvements:

- **40% increase** in student enrollment
- **Better teacher retention** in renovated schools
- **Improved exam performance** in equipped schools
- **Reduced absenteeism** due to better facilities

## Community Involvement

Parents and teachers are actively involved in:
- School management committees
- Maintenance planning
- Quality monitoring
- Feedback sessions

## Next Steps

The program will expand to cover:
- Adult education centers
- Vocational training facilities
- Special needs schools
- Early childhood education centers

Every child in Abia State deserves access to quality education in a safe, conducive environment.
        `,
        image: '/aba_smart_school_1770377231161.png',
        author: 'PIB Communications',
        date: 'January 15, 2026',
        category: 'Education',
        readTime: '5 min read'
    },
    {
        id: 5,
        slug: 'healthcare-facilities-upgrade',
        title: 'Healthcare Transformation: Upgrading Medical Facilities',
        excerpt: 'Modern healthcare facilities are being established across Abia State to improve access to quality medical services.',
        content: `
# Healthcare Transformation: Upgrading Medical Facilities

The PIB is implementing a comprehensive healthcare infrastructure program to ensure all residents of Abia State have access to quality medical care.

## New Healthcare Centers

We're establishing **10 new primary healthcare centers** in underserved areas, each equipped with:

- Modern consultation rooms
- Laboratory facilities
- Maternity wards
- Pharmacy services
- Emergency care units

## Hospital Upgrades

Major hospitals are receiving significant upgrades:

- New medical equipment
- Expanded bed capacity
- Improved emergency departments
- Upgraded operating theaters
- Better waste management systems

## Health Outcomes

The improvements are already making a difference:

- **30% reduction** in maternal mortality
- **Shorter waiting times** for patients
- **Better disease diagnosis** with modern equipment
- **Increased patient satisfaction** ratings

## Medical Personnel

We're supporting healthcare workers through:
- Training programs
- Better working conditions
- Modern equipment and tools
- Continuous professional development

## Preventive Care

New facilities include:
- Immunization centers
- Health education programs
- Disease screening services
- Nutrition counseling

Quality healthcare is a right, not a privilege. The PIB is committed to making it accessible to all.
        `,
        image: '/umuahia_hospital_1770377256349.png',
        author: 'PIB Communications',
        date: 'January 10, 2026',
        category: 'Healthcare',
        readTime: '4 min read'
    },
    {
        id: 6,
        slug: 'renewable-energy-solar-power',
        title: 'Powering the Future: Solar Energy Projects',
        excerpt: 'Abia State is embracing renewable energy with new solar power installations bringing clean electricity to communities.',
        content: `
# Powering the Future: Solar Energy Projects

The PIB is leading Abia State's transition to sustainable energy through strategic solar power projects that provide clean, reliable electricity to communities.

## Solar Grid Installations

Our renewable energy program includes:

- **5 MW solar farm** in Umuahia
- **Street solar lighting** in 20 communities
- **Solar-powered water pumps** in rural areas
- **Off-grid solar systems** for remote locations

## Environmental Benefits

The solar projects are delivering significant environmental gains:

- **2,000 tons** of CO2 emissions avoided annually
- Reduced dependence on diesel generators
- Cleaner air quality
- Sustainable energy model for future growth

## Economic Impact

Communities are experiencing:

- **24/7 electricity** access
- Lower energy costs
- New job opportunities in maintenance
- Improved business operations

## Technology Transfer

We're building local capacity through:
- Solar technician training programs
- Maintenance workshops
- Community energy committees
- School education programs

## Expansion Plans

The program will expand to include:
- Solar-powered schools
- Healthcare facility backup systems
- Agricultural processing centers
- Market electrification

## Success Stories

Local businesses report:
- Extended operating hours
- Increased productivity
- Better product preservation
- Higher customer satisfaction

Abia State is proving that sustainable development and economic growth go hand in hand.
        `,
        image: '/media_solar_grid_1770377546448.png',
        author: 'PIB Communications',
        date: 'December 28, 2025',
        category: 'Energy',
        readTime: '5 min read'
    }
];
