document.addEventListener('DOMContentLoaded', () => {
  // Safely check if Twitch.Player is available
  if (typeof Twitch === 'undefined' || !Twitch.Player) {
    console.error('Twitch embed script not loaded');
    return;
  }

  // Twitch Embed Configuration
  const options = {
    width: '100%',
    height: '100%',
    channel: 'phoenixrovers', // Replace with actual Twitch channel name
    parent: ['localhost', 'phoenixrovers.com'] // Replace with your actual domain
  };

  try {
    // Create Twitch embed
    const embed = new Twitch.Player('twitch-embed', options);

    // Optional: Add controls for interaction
    const matchStatus = document.querySelector('.match-status');
    const scoreHome = document.querySelector('.team.home .score');
    const scoreAway = document.querySelector('.team.away .score');

    // Example function to update match details
    const updateMatchDetails = () => {
      // These could be dynamically fetched from an API or updated via admin panel
      const homeScore = 0;
      const awayScore = 0;

      if (scoreHome && scoreAway) {
        scoreHome.textContent = homeScore;
        scoreAway.textContent = awayScore;
      }

      // Example of updating match status
      if (matchStatus) {
        // Possible statuses: 'to be defined', 'in progress', 'finished'
        const status = 'in progress';
        matchStatus.className = 'match-status'; // Reset classes
        
        switch(status.toLowerCase()) {
          case 'to be defined':
            matchStatus.classList.add('to-be-defined');
            matchStatus.textContent = 'A DEFINIR';
            break;
          case 'in progress':
            matchStatus.classList.add('in-progress');
            matchStatus.textContent = 'EM ANDAMENTO';
            break;
          case 'finished':
            matchStatus.classList.add('finished');
            matchStatus.textContent = 'FINALIZADO';
            break;
        }
      }
    };

    // Update match details periodically or on specific events
    updateMatchDetails();
  } catch (error) {
    console.error('Error setting up Twitch embed:', error);
  }
});