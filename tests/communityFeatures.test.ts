import { CommunityEngine } from '../lib/communityEngine';
import { SpartanDivision, TeamTacticalChallenge, MentorshipProgram } from '../lib/communityEngine';

describe('Social & Community Features', () => {
  let communityEngine: CommunityEngine;

  beforeEach(() => {
    communityEngine = new CommunityEngine();
  });

  describe('Spartan Divisions', () => {
    it('should create a new Spartan division', async () => {
      const division = await communityEngine.createSpartanDivision('user1', {
        name: 'Strength Spartans',
        description: 'Division for strength-focused Spartans',
        specialty: 'strength',
        color: '#ff0000'
      });

      expect(division).toBeDefined();
      expect(division.name).toBe('Strength Spartans');
      expect(division.specialty).toBe('strength');
      expect(division.members).toContain('user1');
    });

    it('should allow users to join divisions', async () => {
      const division = await communityEngine.createSpartanDivision('user1', {
        name: 'Endurance Spartans',
        specialty: 'endurance'
      });

      const result = await communityEngine.joinSpartanDivision('user2', division.id);
      
      expect(result).toBe(true);
      const updatedDivision = await communityEngine.getDivisionLeaderboard(division.id);
      expect(updatedDivision.length).toBe(2);
    });
  });

  describe('Team-based Tactical Challenges', () => {
    it('should create a tactical challenge', async () => {
      const challenge = await communityEngine.createTeamTacticalChallenge('user1', {
        name: 'Urban Warfare Challenge',
        objective: 'Complete urban obstacle course with team coordination',
        difficulty: 'advanced'
      });

      expect(challenge).toBeDefined();
      expect(challenge.name).toBe('Urban Warfare Challenge');
      expect(challenge.difficulty).toBe('advanced');
    });

    it('should update team progress in challenges', async () => {
      // Create a team first
      const team = await communityEngine.createCommunityTeam('user1', {
        name: 'Alpha Team'
      });

      // Create a challenge
      const challenge = await communityEngine.createTeamTacticalChallenge('user2', {
        name: 'Covert Ops Challenge'
      });

      // Register team for challenge
      await communityEngine.registerTeamForTacticalChallenge(team.id, challenge.id);

      // Update progress
      const result = await communityEngine.updateTeamProgress(team.id, challenge.id, 75);
      
      expect(result).toBe(true);
      const leaderboards = await communityEngine.getTacticalChallengeLeaderboards();
      expect(leaderboards[0].leaderboard[0].score).toBe(750); // 75 * 10
    });
  });

  describe('Mentorship Programs', () => {
    it('should create a mentorship program', async () => {
      const program = await communityEngine.createMentorshipProgram('mentor1', 'mentee1', {
        programType: 'beginner',
        goals: {
          shortTerm: ['Learn basic exercises'],
          longTerm: ['Complete first marathon']
        }
      });

      expect(program).toBeDefined();
      expect(program.mentorId).toBe('mentor1');
      expect(program.menteeId).toBe('mentee1');
      expect(program.status).toBe('active');
    });

    it('should update mentorship progress', async () => {
      const program = await communityEngine.createMentorshipProgram('mentor1', 'mentee1', {});
      
      const result = await communityEngine.updateMentorshipProgress(program.id, 50);
      
      expect(result).toBe(true);
      const activePrograms = await communityEngine.getActiveMentorshipPrograms('mentor1');
      expect(activePrograms[0].progress.overall).toBe(50);
    });
  });
});