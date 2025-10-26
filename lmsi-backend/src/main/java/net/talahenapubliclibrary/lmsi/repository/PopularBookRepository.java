package net.talahenapubliclibrary.lmsi.repository;
import net.talahenapubliclibrary.lmsi.entity.PopularBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PopularBookRepository extends JpaRepository<PopularBook, Long> {
}
