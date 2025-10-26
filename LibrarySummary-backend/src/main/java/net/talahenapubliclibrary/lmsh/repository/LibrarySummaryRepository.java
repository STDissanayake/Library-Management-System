package net.talahenapubliclibrary.lmsh.repository;
import net.talahenapubliclibrary.lmsh.entity.LibrarySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibrarySummaryRepository extends JpaRepository<LibrarySummary, Long> {
}
