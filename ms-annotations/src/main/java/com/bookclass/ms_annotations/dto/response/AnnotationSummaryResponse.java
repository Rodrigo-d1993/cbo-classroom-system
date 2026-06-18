package com.bookclass.ms_annotations.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnotationSummaryResponse {
    private Long studentId;
    private Long totalAnnotations;
    private Long positiveCount;
    private Long negativeCount;
    private Long neutralCount;
    private Long leveCount;
    private Long graveCount;
    private Long muyGraveCount;
    private String comportamiento; // EXCELENTE, BUENO, REGULAR, MALO basado en balance
}
