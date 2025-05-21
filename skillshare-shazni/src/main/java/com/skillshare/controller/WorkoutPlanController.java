package com.skillshare.controller;

import com.skillshare.model.WorkoutPlan;
import com.skillshare.service.WorkoutPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/workoutplans")
@CrossOrigin(origins = "*") // Adjust if you have CORS security
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanService workoutPlanService;

    // Create a new workout plan
    @PostMapping
    public WorkoutPlan createWorkoutPlan(@RequestBody WorkoutPlan plan) {
        return workoutPlanService.createWorkoutPlan(plan);
    }

    // Get all workout plans
    @GetMapping
    public List<WorkoutPlan> getAllWorkoutPlans() {
        return workoutPlanService.getAllWorkoutPlans();
    }

    // Get workout plans by user ID
    @GetMapping("/user/{userId}")
    public List<WorkoutPlan> getWorkoutPlansByUserId(@PathVariable String userId) {
        return workoutPlanService.getWorkoutPlansByUserId(userId);
    }

    // Get a workout plan by ID
    @GetMapping("/{id}")
    public Optional<WorkoutPlan> getWorkoutPlanById(@PathVariable String id) {
        return workoutPlanService.getWorkoutPlanById(id);
    }

    // Update a workout plan
    @PutMapping("/{id}")
    public WorkoutPlan updateWorkoutPlan(@PathVariable String id, @RequestBody WorkoutPlan updatedPlan) {
        return workoutPlanService.updateWorkoutPlan(id, updatedPlan);
    }

    // Delete a workout plan
    @DeleteMapping("/{id}")
    public void deleteWorkoutPlan(@PathVariable String id) {
        workoutPlanService.deleteWorkoutPlan(id);
    }
}
