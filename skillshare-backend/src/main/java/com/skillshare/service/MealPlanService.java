package com.skillshare.service;

import com.skillshare.model.MealPlan;
import com.skillshare.repository.MealPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MealPlanService {

    private final MealPlanRepository mealPlanRepo;

    public MealPlan createPlan(MealPlan plan) {
        return mealPlanRepo.save(plan);
    }

    public List<MealPlan> getAllPlans() {
        return mealPlanRepo.findAll();
    }

    public List<MealPlan> getPlansByUserId(String userId) {
        return mealPlanRepo.findByUserId(userId);
    }

    public Optional<MealPlan> getPlanById(String id) {
        return mealPlanRepo.findById(id);
    }

    public Optional<MealPlan> updatePlan(String id, MealPlan updated) {
        return mealPlanRepo.findById(id).map(plan -> {
            plan.setTitle(updated.getTitle());
            plan.setDescription(updated.getDescription());
            plan.setTopics(updated.getTopics());
            plan.setDeadline(updated.getDeadline());
            return mealPlanRepo.save(plan);
        });
    }

    public void deletePlan(String id) {
        mealPlanRepo.deleteById(id);
    }
}
