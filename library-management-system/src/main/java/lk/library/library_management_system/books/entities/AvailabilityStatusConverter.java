package lk.library.library_management_system.books.entities;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AvailabilityStatusConverter implements AttributeConverter<AvailabilityStatus, String> {

    @Override
    public String convertToDatabaseColumn(AvailabilityStatus attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name();
    }

    @Override
    public AvailabilityStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return AvailabilityStatus.valueOf(dbData);
    }
}