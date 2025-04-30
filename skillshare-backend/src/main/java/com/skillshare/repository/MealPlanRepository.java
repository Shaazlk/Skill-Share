package com.skillshare.repository;

import com.skillshare.model.MealPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealPlanRepository extends MongoRepository<MealPlan, String> {
    List<MealPlan> findByUserId(String userId);
}
