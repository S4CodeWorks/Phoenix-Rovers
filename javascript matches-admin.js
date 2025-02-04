document.addEventListener('DOMContentLoaded', () => {
  class MatchAdmin {
    constructor() {
      this.initElements();
      this.addEventListeners();
      this.loadMatchData();
    }

    initElements() {
      this.matchesContainer = document.querySelector('.matches-grid');
      this.matchModal = this.createModal();
      document.body.appendChild(this.matchModal);
    }

    createModal() {
      const modal = document.createElement('div');
      modal.classList.add('match-admin-modal');
      modal.innerHTML = `
        <div class="modal-content">
          <h2>Editar Informações do Jogo</h2>
          <form id="match-edit-form">
            <div class="form-group">
              <label>Time da Casa</label>
              <input type="text" name="homeTeam" required>
            </div>
            <div class="form-group">
              <label>Placar Time da Casa</label>
              <input type="number" name="homeScore" min="0">
            </div>
            <div class="form-group">
              <label>Time Visitante</label>
              <input type="text" name="awayTeam" required>
            </div>
            <div class="form-group">
              <label>Placar Time Visitante</label>
              <input type="number" name="awayScore" min="0">
            </div>
            <div class="form-group">
              <label>Data do Jogo</label>
              <input type="date" name="matchDate" required>
            </div>
            <div class="form-group">
              <label>Competição</label>
              <input type="text" name="competition" required>
            </div>
            <div class="form-group">
              <label>Status do Jogo</label>
              <select name="matchStatus">
                <option value="to-be-defined">A Definir</option>
                <option value="in-progress">Em Andamento</option>
                <option value="finished">Finalizado</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn-save">Salvar</button>
              <button type="button" class="btn-cancel">Cancelar</button>
            </div>
          </form>
        </div>
      `;
      return modal;
    }

    addEventListeners() {
      // Open modal for each match card
      this.matchesContainer.addEventListener('dblclick', (e) => {
        const matchCard = e.target.closest('.match-card');
        if (matchCard) {
          this.openMatchEditModal(matchCard);
        }
      });

      // Close modal when clicking cancel
      this.matchModal.querySelector('.btn-cancel').addEventListener('click', () => {
        this.closeModal();
      });

      // Handle form submission
      this.matchModal.querySelector('#match-edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.updateMatchDetails(e.target);
      });

      // Close modal when clicking outside
      this.matchModal.addEventListener('click', (e) => {
        if (e.target === this.matchModal) {
          this.closeModal();
        }
      });
    }

    openMatchEditModal(matchCard) {
      const homeTeam = matchCard.querySelector('.team.home .team-name');
      const awayTeam = matchCard.querySelector('.team.away .team-name');
      const matchDate = matchCard.querySelector('.match-date');
      const matchCompetition = matchCard.querySelector('.match-competition');

      const form = this.matchModal.querySelector('form');
      form.elements.homeTeam.value = homeTeam.textContent;
      form.elements.awayTeam.value = awayTeam.textContent;
      form.elements.matchDate.value = this.formatDateForInput(matchDate.textContent);
      form.elements.competition.value = matchCompetition.textContent;

      // Store reference to current match card
      this.currentMatchCard = matchCard;

      this.matchModal.classList.add('active');
    }

    formatDateForInput(dateString) {
      // Convert "A definir" to today's date
      if (dateString === 'A definir') {
        return new Date().toISOString().split('T')[0];
      }
      // Add parsing logic for specific date formats if needed
      return dateString;
    }

    updateMatchDetails(form) {
      if (!this.currentMatchCard) return;

      const homeTeam = this.currentMatchCard.querySelector('.team.home .team-name');
      const awayTeam = this.currentMatchCard.querySelector('.team.away .team-name');
      const matchDate = this.currentMatchCard.querySelector('.match-date');
      const matchCompetition = this.currentMatchCard.querySelector('.match-competition');
      const homeScore = this.currentMatchCard.querySelector('.team.home .score');
      const awayScore = this.currentMatchCard.querySelector('.team.away .score');
      const matchStatus = this.currentMatchCard.querySelector('.match-status');

      // Update match card details
      homeTeam.textContent = form.elements.homeTeam.value;
      awayTeam.textContent = form.elements.awayTeam.value;
      matchDate.textContent = form.elements.matchDate.value;
      matchCompetition.textContent = form.elements.competition.value;

      // Update scores if provided
      if (form.elements.homeScore.value !== '') {
        homeScore.textContent = form.elements.homeScore.value;
      }
      if (form.elements.awayScore.value !== '') {
        awayScore.textContent = form.elements.awayScore.value;
      }

      // Update match status
      const status = form.elements.matchStatus.value;
      matchStatus.className = 'match-status'; // Reset classes
      switch(status) {
        case 'to-be-defined':
          matchStatus.classList.add('to-be-defined');
          matchStatus.textContent = 'A DEFINIR';
          break;
        case 'in-progress':
          matchStatus.classList.add('in-progress');
          matchStatus.textContent = 'EM ANDAMENTO';
          break;
        case 'finished':
          matchStatus.classList.add('finished');
          matchStatus.textContent = 'FINALIZADO';
          break;
      }

      this.closeModal();
      this.saveMatchData();
    }

    closeModal() {
      this.matchModal.classList.remove('active');
      this.currentMatchCard = null;
    }

    // Persistence methods
    saveMatchData() {
      const matchData = [];
      this.matchesContainer.querySelectorAll('.match-card').forEach(card => {
        const data = {
          homeTeam: card.querySelector('.team.home .team-name').textContent,
          awayTeam: card.querySelector('.team.away .team-name').textContent,
          homeScore: card.querySelector('.team.home .score')?.textContent,
          awayScore: card.querySelector('.team.away .score')?.textContent,
          matchDate: card.querySelector('.match-date').textContent,
          competition: card.querySelector('.match-competition').textContent,
          status: card.querySelector('.match-status').textContent
        };
        matchData.push(data);
      });

      localStorage.setItem('phoenixRoversMatchData', JSON.stringify(matchData));
    }

    loadMatchData() {
      const savedData = localStorage.getItem('phoenixRoversMatchData');
      if (savedData) {
        const matchData = JSON.parse(savedData);
        const matchCards = this.matchesContainer.querySelectorAll('.match-card');

        matchData.forEach((data, index) => {
          if (index < matchCards.length) {
            const card = matchCards[index];
            card.querySelector('.team.home .team-name').textContent = data.homeTeam;
            card.querySelector('.team.away .team-name').textContent = data.awayTeam;
            
            // Update scores if they exist
            const homeScoreEl = card.querySelector('.team.home .score');
            const awayScoreEl = card.querySelector('.team.away .score');
            if (homeScoreEl) homeScoreEl.textContent = data.homeScore || '---';
            if (awayScoreEl) awayScoreEl.textContent = data.awayScore || '---';
            
            card.querySelector('.match-date').textContent = data.matchDate;
            card.querySelector('.match-competition').textContent = data.competition;
            
            // Update status
            const statusEl = card.querySelector('.match-status');
            statusEl.className = 'match-status';
            if (data.status.includes('A DEFINIR')) {
              statusEl.classList.add('to-be-defined');
            } else if (data.status.includes('EM ANDAMENTO')) {
              statusEl.classList.add('in-progress');
            } else if (data.status.includes('FINALIZADO')) {
              statusEl.classList.add('finished');
            }
            statusEl.textContent = data.status;
          }
        });
      }
    }
  }

  // Initialize the match admin
  new MatchAdmin();
});