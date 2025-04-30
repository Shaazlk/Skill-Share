package com.skillshare.controller;

import com.skillshare.model.MealPlan;
import com.skillshare.service.MealPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/mealplans")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService mealPlanService;

    @PostMapping
    public ResponseEntity<?> createPlan(@RequestBody MealPlan plan) {
        MealPlan created = mealPlanService.createPlan(plan);
        return ResponseEntity.ok(Map.of("message", "Meal Plan created ✅", "plan", created));
    }

    @GetMapping
    public ResponseEntity<?> getAllPlans() {
        List<MealPlan> plans = mealPlanService.getAllPlans();
        return ResponseEntity.ok(Map.of("count", plans.size(), "plans", plans));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPlansByUser(@PathVariable String userId) {
        List<MealPlan> plans = mealPlanService.getPlansByUserId(userId);
        return ResponseEntity.ok(Map.of("count", plans.size(), "plans", plans));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, MealPlan>> getPlanById(@PathVariable String id) {
        return mealPlanService.getPlanById(id)
                .map(plan -> ResponseEntity.ok(Map.of("plan", plan)))
                .orElse(ResponseEntity.status(404).body(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlan(@PathVariable String id, @RequestBody MealPlan plan) {
        return mealPlanService.updatePlan(id, plan)
                .map(updated -> ResponseEntity.ok(Map.of("message", "Meal Plan updated ✅", "plan", updated)))
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Meal Plan not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable String id) {
        mealPlanService.deletePlan(id);
        return ResponseEntity.ok(Map.of("message", "Meal Plan deleted ✅"));
    }
}
