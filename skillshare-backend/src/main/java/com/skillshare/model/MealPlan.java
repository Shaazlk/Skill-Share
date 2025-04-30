package com.skillshare.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "mealplans")
public class MealPlan {

    @Id
    private String id;

    private String userId;
    private String title;
    private String description;
    private List<String> topics;
    private String deadline;
}
