package net.talahenapubliclibrary.mapper;
import net.talahenapubliclibrary.dto.FineDto;
import net.talahenapubliclibrary.entity.Fine;

public class FineMapper {

    public static FineDto toDto(Fine f) {
        if (f == null) return null;
        return new FineDto(
                f.getFineId(),
                f.getIssueId(),
                f.getAmount(),
                f.getReason(),
                f.getStatus(),
                f.getGeneratedDate(),
                f.getPaymentDate()
        );
    }

    public static Fine toEntity(FineDto dto) {
        if (dto == null) return null;
        Fine f = new Fine();
        f.setFineId(dto.getFineId());
        f.setIssueId(dto.getIssueId());
        f.setAmount(dto.getAmount());
        f.setReason(dto.getReason());
        f.setStatus(dto.getStatus());
        f.setGeneratedDate(dto.getGeneratedDate());
        f.setPaymentDate(dto.getPaymentDate());
        return f;
    }
}
