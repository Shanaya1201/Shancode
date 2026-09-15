-- ==============================================================================
-- SHANCODE PLATFORM: Supabase PostgreSQL Stored Functions & Triggers Migration (003)
-- ==============================================================================

-- 1. Automated updated_at Timestamp Function
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach timestamp triggers
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_concept_progress_updated_at ON concept_progress;
CREATE TRIGGER trg_concept_progress_updated_at BEFORE UPDATE ON concept_progress FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 2. Database Sequential Unlocking Validator Function
CREATE OR REPLACE FUNCTION is_concept_unlocked(p_user_id BIGINT, p_concept_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  v_uncompleted_prereqs_count INTEGER;
  v_sec_id BIGINT;
  v_order_idx INTEGER;
  v_prev_completed SMALLINT;
BEGIN
  -- Check explicit prerequisite graph
  SELECT COUNT(*) INTO v_uncompleted_prereqs_count
  FROM concept_dependencies cd
  LEFT JOIN concept_progress cp ON cp.concept_id = cd.prerequisite_id AND cp.user_id = p_user_id
  WHERE cd.concept_id = p_concept_id AND COALESCE(cp.completed, 0) = 0;

  IF v_uncompleted_prereqs_count > 0 THEN
    RETURN FALSE;
  END IF;

  -- Check sequential previous lesson
  SELECT section_id, order_index INTO v_sec_id, v_order_idx
  FROM concepts WHERE id = p_concept_id;

  IF v_sec_id = 1 AND v_order_idx = 1 THEN
    RETURN TRUE;
  END IF;

  IF v_order_idx > 1 THEN
    SELECT COALESCE(cp.completed, 0) INTO v_prev_completed
    FROM concepts c
    LEFT JOIN concept_progress cp ON cp.concept_id = c.id AND cp.user_id = p_user_id
    WHERE c.section_id = v_sec_id AND c.order_index = v_order_idx - 1;

    IF v_prev_completed = 0 THEN
      RETURN FALSE;
    END IF;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger preventing progress updates on locked concepts
CREATE OR REPLACE FUNCTION check_concept_unlock_before_progress()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_concept_unlocked(NEW.user_id, NEW.concept_id) THEN
    RAISE EXCEPTION 'Cannot record progress on locked concept ID %. Prerequisites incomplete.', NEW.concept_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_unlock ON concept_progress;
CREATE TRIGGER trg_enforce_unlock
BEFORE INSERT OR UPDATE ON concept_progress
FOR EACH ROW EXECUTE FUNCTION check_concept_unlock_before_progress();
