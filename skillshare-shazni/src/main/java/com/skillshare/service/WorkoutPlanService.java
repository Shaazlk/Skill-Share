package com.skillshare.service;

import com.skillshare.model.WorkoutPlan;
import com.skillshare.repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkoutPlanService {

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    // Create new workout plan
    public WorkoutPlan createWorkoutPlan(WorkoutPlan plan) {
        return workoutPlanRepository.save(plan);
    }

    // Get all workout plans
    public List<WorkoutPlan> getAllWorkoutPlans() {
        return workoutPlanRepository.findAll();
    }

    // Get workout plan by ID
    public Optional<WorkoutPlan> getWorkoutPlanById(String id) {
        return workoutPlanRepository.findById(id);
    }

    // Get workout plans by user ID
    public List<WorkoutPlan> getWorkoutPlansByUserId(String userId) {
        return workoutPlanRepository.findByUserId(userId);
    }

    // Update workout plan
    public WorkoutPlan updateWorkoutPlan(String id, WorkoutPlan updatedPlan) {
        Optional<WorkoutPlan> existingPlanOpt = workoutPlanRepository.findById(id);
        if (existingPlanOpt.isPresent()) {
            WorkoutPlan existingPlan = existingPlanOpt.get();
            existingPlan.setTitle(updatedPlan.getTitle());
            existingPlan.setDescription(updatedPlan.getDescription());
            existingPlan.setDeadline(updatedPlan.getDeadline());
            existingPlan.setExercises(updatedPlan.getExercises());
            existingPlan.setStatus(updatedPlan.getStatus());
            return workoutPlanRepository.save(existingPlan);
        }
        return null;
    }

    // Delete workout plan
    public void deleteWorkoutPlan(String id) {
        workoutPlanRepository.deleteById(id);
    }
}
